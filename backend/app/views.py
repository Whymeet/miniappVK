from django.conf import settings
from django.http import JsonResponse
from django.shortcuts import redirect
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .brands import get_brand_config
from .offers import get_offers, get_offer_by_id
from .models import ClickLog


@api_view(['GET'])
def config_view(request):
    """
    GET /api/config?group_id=123&brand=kokos
    
    Возвращает конфигурацию бренда.
    """
    group_id = request.GET.get('group_id')
    brand = request.GET.get('brand')
    default_brand = settings.DEFAULT_BRAND
    
    brand_config = get_brand_config(
        group_id=group_id,
        brand=brand,
        default_brand=default_brand
    )
    
    return Response({
        'success': True,
        'data': brand_config
    })


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
    
    # Получаем оффер
    offer = get_offer_by_id(offer_id)
    if not offer:
        return Response(
            {'success': False, 'error': 'Offer not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Логируем клик
    try:
        ClickLog.objects.create(
            offer_id=offer_id,
            vk_user_id=vk_user_id,
            group_id=group_id,
            brand=brand,
            ip_address=get_client_ip(request),
            user_agent=request.META.get('HTTP_USER_AGENT', '')
        )
    except Exception as e:
        # Не падаем, если логирование не удалось
        print(f"Failed to log click: {e}")
    
    # Формируем sub_id для отслеживания
    sub_id = f"vk_{vk_user_id}_{group_id}_{offer_id}" if vk_user_id else offer_id
    
    # Редирект на партнёрскую ссылку
    redirect_url = offer['redirect_url'].format(sub_id=sub_id)
    
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

