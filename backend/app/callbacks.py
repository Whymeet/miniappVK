"""
VK Callback API для автоматического обновления статусов подписки.
https://dev.vk.com/api/callback/getting-started
"""
import json
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from django.utils import timezone
from .models import Subscriber


@csrf_exempt
def vk_callback_view(request):
    """
    POST /api/vk-callback/
    
    Обработчик событий VK Callback API.
    Обрабатывает события: message_allow, message_deny
    """
    if request.method != 'POST':
        return HttpResponse('Method not allowed', status=405)
    
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return HttpResponse('Invalid JSON', status=400)
    
    # Проверка секретного ключа
    secret = data.get('secret')
    vk_secret = getattr(settings, 'VK_CALLBACK_SECRET', None)
    
    if vk_secret and secret != vk_secret:
        return HttpResponse('Invalid secret', status=403)
    
    event_type = data.get('type')
    
    # Подтверждение сервера (первый запрос от VK)
    if event_type == 'confirmation':
        confirmation_code = getattr(settings, 'VK_CONFIRMATION_CODE', '')
        return HttpResponse(confirmation_code, content_type='text/plain')
    
    # Обработка события разрешения сообщений
    if event_type == 'message_allow':
        handle_message_allow(data.get('object', {}))
        return HttpResponse('ok', content_type='text/plain')
    
    # Обработка события запрета сообщений
    if event_type == 'message_deny':
        handle_message_deny(data.get('object', {}))
        return HttpResponse('ok', content_type='text/plain')
    
    # Для всех остальных событий просто возвращаем 'ok'
    return HttpResponse('ok', content_type='text/plain')


def handle_message_allow(event_data):
    """
    Обработка события message_allow.
    
    Event data: {
        "user_id": 123456,
        "key": "..."
    }
    """
    user_id = str(event_data.get('user_id'))
    
    if not user_id:
        return
    
    try:
        subscriber = Subscriber.objects.get(vk_user_id=user_id)
        subscriber.allowed_from_group = True
        if not subscriber.subscribed_at:
            subscriber.subscribed_at = timezone.now()
        subscriber.save()
        print(f"✅ Message allowed for user {user_id}")
    except Subscriber.DoesNotExist:
        # Если подписчика ещё нет, создаём с минимальными данными
        Subscriber.objects.create(
            vk_user_id=user_id,
            group_id='',
            brand='default',
            subscribed=True,
            allowed_from_group=True,
            subscribed_at=timezone.now(),
        )
        print(f"✅ Created subscriber for user {user_id} from callback")


def handle_message_deny(event_data):
    """
    Обработка события message_deny.
    
    Event data: {
        "user_id": 123456
    }
    """
    user_id = str(event_data.get('user_id'))
    
    if not user_id:
        return
    
    try:
        subscriber = Subscriber.objects.get(vk_user_id=user_id)
        subscriber.allowed_from_group = False
        subscriber.save()
        print(f"❌ Message denied for user {user_id}")
    except Subscriber.DoesNotExist:
        # Если подписчика нет, игнорируем
        pass

