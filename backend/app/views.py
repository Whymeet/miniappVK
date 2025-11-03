from django.conf import settings
from django.http import JsonResponse
from django.shortcuts import redirect
from django.utils import timezone
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django_ratelimit.decorators import ratelimit

from .brands import get_brand_config
from .offers import get_offers, get_offer_by_id
from .models import ClickLog, Subscriber, Offer, AppConfig
from .vk_api import check_messages_allowed, VKAPIError
from .statistics import (
    get_offer_statistics,
    get_brand_statistics,
    get_daily_statistics,
    get_top_offers,
    get_conversion_rate,
    get_subscriber_statistics,
    get_offer_performance,
    get_dashboard_summary
)


@ratelimit(key='ip', rate='60/m', method='GET')  # 60 запросов в минуту с IP
@api_view(['GET'])
def config_view(request):
    """
    GET /api/config
    
    Возвращает единую конфигурацию внешнего вида приложения.
    Параметры group_id и brand игнорируются - используется единая конфигурация из БД.
    """
    # Получаем единую конфигурацию из БД
    try:
        app_config = AppConfig.get_or_create_config()
        config_data = app_config.to_dict()
    except Exception as e:
        # Fallback на старую систему если что-то пошло не так
        print(f"Failed to load AppConfig: {e}")
        group_id = request.GET.get('group_id')
        brand = request.GET.get('brand')
        default_brand = settings.DEFAULT_BRAND
        config_data = get_brand_config(
            group_id=group_id,
            brand=brand,
            default_brand=default_brand
        )
    
    return Response({
        'success': True,
        'data': config_data
    })


@ratelimit(key='ip', rate='100/m', method='GET')  # 100 запросов в минуту с IP
@api_view(['GET'])
def offers_view(request):
    """
    GET /api/offers?group_id=123&sum_need=10000&term_days=30&sort=rate&page=1
    
    Возвращает список офферов с фильтрацией и сортировкой.
    """
    sum_need = request.GET.get('sum_need')
    term_days = request.GET.get('term_days')
    sort_by = request.GET.get('sort', 'rate')
    page = int(request.GET.get('page', 1))
    page_size = int(request.GET.get('page_size', 20))
    
    offers_data = get_offers(
        sum_need=sum_need,
        term_days=term_days,
        sort_by=sort_by,
        page=page,
        page_size=page_size
    )
    
    return Response({
        'success': True,
        'data': offers_data
    })


@api_view(['GET'])
def offer_redirect_view(request, offer_id):
    """
    GET /go/:offer_id?vk_user_id=123&group_id=456
    
    Логирует клик и делает редирект на партнёрскую ссылку.
    """
    vk_user_id = request.GET.get('vk_user_id')
    group_id = request.GET.get('group_id')
    brand = request.GET.get('brand')
    
    # Получаем оффер из БД
    try:
        offer_obj = Offer.objects.get(id=offer_id, is_active=True)
    except Offer.DoesNotExist:
        return Response(
            {'success': False, 'error': 'Offer not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Логируем клик
    try:
        # Находим подписчика если есть
        subscriber = None
        if vk_user_id:
            try:
                subscriber = Subscriber.objects.get(vk_user_id=vk_user_id)
            except Subscriber.DoesNotExist:
                pass
        
        ClickLog.objects.create(
            offer=offer_obj,
            vk_user_id=vk_user_id,
            subscriber=subscriber,
            group_id=group_id,
            brand=brand,
            ip_address=get_client_ip(request),
            user_agent=request.META.get('HTTP_USER_AGENT', '')
        )
    except Exception as e:
        # Не падаем, если логирование не удалось
        print(f"Failed to log click: {e}")
    
    # Редирект на партнёрскую ссылку (используем URL как есть, без модификаций)
    redirect_url = offer_obj.redirect_url
    
    return redirect(redirect_url)


def get_client_ip(request):
    """Получить IP адрес клиента"""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


@api_view(['GET'])
def health_check(request):
    """Проверка работоспособности API"""
    return Response({
        'status': 'ok',
        'service': 'vk-miniapp-backend'
    })


# ============================================================================
# SUBSCRIPTION API
# ============================================================================

@ratelimit(key='ip', rate='20/m', method='POST')  # 20 запросов в минуту с IP
@api_view(['POST'])
def subscribe_view(request):
    """
    POST /api/subscribe/
    
    Сохранение VK ID при входе пользователя в приложение.
    Создаёт или обновляет запись подписчика.
    
    Body: { launch_params: {...} }  - параметры запуска VK с подписью
    
    Примечание: VK подпись проверяется автоматически через middleware.
    """
    # Получаем проверенный vk_user_id из middleware
    vk_user_id = getattr(request, 'vk_user_id', None)
    
    if not vk_user_id:
        return Response(
            {'success': False, 'error': 'VK user ID not found in verified launch params'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Получаем дополнительные параметры из launch_params
    launch_params = getattr(request, 'launch_params', {})
    group_id = launch_params.get('vk_group_id') or request.data.get('group_id')
    brand = request.data.get('brand')
    
    # Создаём или обновляем подписчика
    subscriber, created = Subscriber.objects.get_or_create(
        vk_user_id=vk_user_id,
        defaults={
            'group_id': group_id or '',
            'brand': brand or 'default',
            'subscribed': True,
        }
    )
    
    # Если уже существовал, обновляем данные
    if not created:
        # Если пользователь был отписан, снова подписываем
        if not subscriber.subscribed:
            subscriber.subscribed = True
            subscriber.subscribed_at = timezone.now()
            subscriber.unsubscribed_at = None
        
        # Обновляем группу и бренд если изменились
        if group_id and subscriber.group_id != group_id:
            subscriber.group_id = group_id
        if brand and subscriber.brand != brand:
            subscriber.brand = brand
        
        subscriber.save()
    
    return Response({
        'success': True,
        'data': {
            'vk_user_id': subscriber.vk_user_id,
            'subscribed': subscriber.subscribed,
            'allowed_from_group': subscriber.allowed_from_group,
            'created': created,
        }
    })


@ratelimit(key='ip', rate='20/m', method='POST')
@api_view(['POST'])
def allow_messages_view(request):
    """
    POST /api/subscribe/allow-messages/
    
    Обновление статуса после разрешения уведомлений.
    Проверяет через VK API и устанавливает allowed_from_group=True.
    
    Body: { launch_params: {...}, group_id: "123" }  - параметры запуска VK с подписью
    
    Примечание: VK подпись проверяется автоматически через middleware.
    """
    # Получаем проверенные данные из middleware
    vk_user_id = getattr(request, 'vk_user_id', None)
    launch_params = getattr(request, 'launch_params', {})
    
    # Получаем group_id из разных источников
    group_id = (
        request.data.get('group_id') or 
        launch_params.get('vk_group_id') or 
        launch_params.get('group_id')
    )
    
    if not vk_user_id:
        return Response(
            {'success': False, 'error': 'vk_user_id not found in verified launch params'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if not group_id:
        return Response(
            {'success': False, 'error': 'group_id is required. Please provide group_id in request body.'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        subscriber = Subscriber.objects.get(vk_user_id=vk_user_id)
    except Subscriber.DoesNotExist:
        return Response(
            {'success': False, 'error': 'Subscriber not found. Please subscribe first.'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Проверяем через VK API (опционально)
    vk_allowed = None
    try:
        vk_allowed = check_messages_allowed(group_id, vk_user_id)
    except VKAPIError as e:
        # Если VK API недоступен, просто логируем, но не падаем
        print(f"VK API check failed: {e}")
    
    # Обновляем статус
    subscriber.allowed_from_group = True
    if not subscriber.subscribed_at:
        subscriber.subscribed_at = timezone.now()
    subscriber.save()
    
    return Response({
        'success': True,
        'data': {
            'vk_user_id': subscriber.vk_user_id,
            'allowed_from_group': subscriber.allowed_from_group,
            'vk_api_confirmed': vk_allowed,
        }
    })


@ratelimit(key='ip', rate='10/m', method='POST')
@api_view(['POST'])
def unsubscribe_view(request):
    """
    POST /api/unsubscribe/
    
    Отписка пользователя от рассылки.
    
    Body: { launch_params: {...} }  - параметры запуска VK с подписью
    
    Примечание: VK подпись проверяется автоматически через middleware.
    """
    # Получаем проверенный vk_user_id из middleware
    vk_user_id = getattr(request, 'vk_user_id', None)
    
    if not vk_user_id:
        return Response(
            {'success': False, 'error': 'VK user ID not found in verified launch params'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        subscriber = Subscriber.objects.get(vk_user_id=vk_user_id)
        subscriber.subscribed = False
        subscriber.unsubscribed_at = timezone.now()
        subscriber.save()
        
        return Response({
            'success': True,
            'data': {
                'vk_user_id': subscriber.vk_user_id,
                'subscribed': subscriber.subscribed,
            }
        })
    except Subscriber.DoesNotExist:
        return Response(
            {'success': False, 'error': 'Subscriber not found'},
            status=status.HTTP_404_NOT_FOUND
        )


@ratelimit(key='ip', rate='30/m', method='GET')
@api_view(['GET'])
def subscription_status_view(request):
    """
    GET /api/subscription/status/
    
    Получение статуса подписки пользователя.
    Параметры запуска VK должны быть переданы через query параметры с подписью.
    
    Примечание: VK подпись проверяется автоматически через middleware.
    """
    # Получаем проверенный vk_user_id из middleware
    vk_user_id = getattr(request, 'vk_user_id', None)
    
    if not vk_user_id:
        return Response(
            {'success': False, 'error': 'VK user ID not found in verified launch params'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        subscriber = Subscriber.objects.get(vk_user_id=vk_user_id)
        return Response({
            'success': True,
            'data': {
                'vk_user_id': subscriber.vk_user_id,
                'subscribed': subscriber.subscribed,
                'allowed_from_group': subscriber.allowed_from_group,
                'can_receive_messages': subscriber.can_receive_messages,
                'created_at': subscriber.created_at,
                'subscribed_at': subscriber.subscribed_at,
                'brand': subscriber.brand,
            }
        })
    except Subscriber.DoesNotExist:
        return Response({
            'success': True,
            'data': {
                'vk_user_id': vk_user_id,
                'subscribed': False,
                'allowed_from_group': False,
                'can_receive_messages': False,
            }
        })

