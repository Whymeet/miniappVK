"""
Интеграция с VK API для проверки разрешений на отправку сообщений.
"""
import requests
from django.conf import settings


VK_API_VERSION = '5.131'
VK_API_BASE_URL = 'https://api.vk.com/method/'


class VKAPIError(Exception):
    """Ошибка при работе с VK API"""
    pass


def check_messages_allowed(group_id: str, user_id: str, access_token: str = None) -> bool:
    """
    Проверяет, разрешил ли пользователь сообществу отправлять ему сообщения.
    
    Args:
        group_id: ID сообщества VK
        user_id: ID пользователя VK
        access_token: Токен доступа сообщества (берется из settings, если не указан)
    
    Returns:
        True если разрешено, False если нет
        
    Raises:
        VKAPIError: При ошибке запроса к VK API
    """
    if access_token is None:
        access_token = getattr(settings, 'VK_GROUP_ACCESS_TOKEN', None)
    
    if not access_token:
        raise VKAPIError('VK_GROUP_ACCESS_TOKEN not configured')
    
    url = f'{VK_API_BASE_URL}messages.isMessagesFromGroupAllowed'
    
    params = {
        'group_id': group_id,
        'user_id': user_id,
        'access_token': access_token,
        'v': VK_API_VERSION,
    }
    
    try:
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        if 'error' in data:
            error_msg = data['error'].get('error_msg', 'Unknown error')
            error_code = data['error'].get('error_code', 0)
            raise VKAPIError(f'VK API error {error_code}: {error_msg}')
        
        # response.is_allowed: 0 или 1
        is_allowed = data.get('response', {}).get('is_allowed', 0)
        return bool(is_allowed)
        
    except requests.RequestException as e:
        raise VKAPIError(f'Request to VK API failed: {str(e)}')


def send_message(user_id: str, message: str, group_id: str = None, access_token: str = None) -> dict:
    """
    Отправляет сообщение пользователю от имени сообщества.
    
    Args:
        user_id: ID пользователя VK
        message: Текст сообщения
        group_id: ID сообщества (опционально, для логирования)
        access_token: Токен доступа сообщества
    
    Returns:
        dict с результатом отправки
        
    Raises:
        VKAPIError: При ошибке отправки
    """
    if access_token is None:
        access_token = getattr(settings, 'VK_GROUP_ACCESS_TOKEN', None)
    
    if not access_token:
        raise VKAPIError('VK_GROUP_ACCESS_TOKEN not configured')
    
    url = f'{VK_API_BASE_URL}messages.send'
    
    import random
    random_id = random.randint(0, 2**31)
    
    params = {
        'user_id': user_id,
        'message': message,
        'random_id': random_id,
        'access_token': access_token,
        'v': VK_API_VERSION,
    }
    
    try:
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        if 'error' in data:
            error_msg = data['error'].get('error_msg', 'Unknown error')
            error_code = data['error'].get('error_code', 0)
            raise VKAPIError(f'VK API error {error_code}: {error_msg}')
        
        return data.get('response', {})
        
    except requests.RequestException as e:
        raise VKAPIError(f'Request to VK API failed: {str(e)}')

