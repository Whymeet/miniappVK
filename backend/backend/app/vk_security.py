"""
Модуль безопасности для работы с VK Mini Apps.
Проверка подписи параметров запуска и защита от подделки данных.
"""
import hashlib
import hmac
import logging
from typing import Dict, Optional
from urllib.parse import urlencode
from django.conf import settings

logger = logging.getLogger(__name__)


def verify_vk_launch_params(params: Dict[str, str]) -> bool:
    """
    Проверяет подпись параметров запуска VK Mini App.
    
    Документация: https://dev.vk.com/ru/mini-apps/development/launch-params
    
    Args:
        params: Словарь с параметрами запуска, включая 'sign'
        
    Returns:
        True если подпись валидна, False в противном случае
    """
    import base64
    
    if not params:
        logger.warning("VK signature check: empty params")
        return False
    
    sign = params.get('sign')
    if not sign:
        logger.warning("VK signature check: missing 'sign' parameter")
        return False
    
    vk_app_secret = settings.VK_APP_SECRET
    if not vk_app_secret:
        logger.error("VK signature check: VK_APP_SECRET not configured")
        return False
    
    # Фильтруем только vk_* параметры (исключая sign)
    vk_params = {
        k: v for k, v in params.items() 
        if k.startswith('vk_') and k != 'sign'
    }
    
    if not vk_params:
        logger.warning("VK signature check: no vk_* parameters found")
        return False
    
    # Сортируем параметры и создаем строку для подписи
    sorted_params = sorted(vk_params.items())
    query_string = urlencode(sorted_params)
    
    # Вычисляем HMAC-SHA256 подпись
    try:
        secret_bytes = vk_app_secret.encode('utf-8')
        query_bytes = query_string.encode('utf-8')
        
        # Вычисляем HMAC
        signature = hmac.new(
            secret_bytes,
            query_bytes,
            hashlib.sha256
        ).digest()
        
        # Конвертируем в base64url (как VK отправляет)
        # VK использует стандартную base64url кодировку с заменой символов
        calculated_sign = base64.urlsafe_b64encode(signature).decode('utf-8').rstrip('=')
        
        # Простое сравнение с заменой символов base64url
        # VK использует base64url с символами _ и -, а мы вычисляем с / и +
        normalized_sign = sign.replace('_', '/').replace('-', '+')
        is_valid = calculated_sign == normalized_sign
        
        if not is_valid:
            logger.warning(
                f"VK signature check failed: expected {calculated_sign}, got {sign}, normalized: {normalized_sign}"
            )
        
        return is_valid
        
    except Exception as e:
        logger.error(f"VK signature check error: {e}")
        return False


def extract_vk_user_id(params: Dict[str, str], verify_signature: bool = True) -> Optional[str]:
    """
    Извлекает vk_user_id из параметров запуска с опциональной проверкой подписи.
    
    Args:
        params: Словарь с параметрами запуска
        verify_signature: Проверять ли подпись (по умолчанию True)
        
    Returns:
        vk_user_id если валидный, None в противном случае
    """
    if verify_signature and not verify_vk_launch_params(params):
        return None
    
    return params.get('vk_user_id')


def get_launch_params_from_request(request) -> Optional[Dict[str, str]]:
    """
    Извлекает параметры запуска VK из запроса.
    Поддерживает как JSON body, так и query параметры.
    
    Args:
        request: Django request объект
        
    Returns:
        Словарь с параметрами запуска или None
    """
    # Логируем что пришло в запросе
    logger.warning(f"DEBUG get_launch_params: method={request.method}, path={request.path}")
    logger.warning(f"DEBUG has_data={hasattr(request, 'data')}")
    if hasattr(request, 'data'):
        logger.warning(f"DEBUG request.data type={type(request.data)}, keys={list(request.data.keys()) if hasattr(request.data, 'keys') else 'N/A'}")
        logger.warning(f"DEBUG request.data content={request.data}")
    if request.body:
        logger.warning(f"DEBUG request.body={request.body[:500]}")
    
    # Пробуем получить из body (для POST запросов)
    if hasattr(request, 'data') and request.data:
        launch_params = request.data.get('launch_params')
        logger.warning(f"DEBUG launch_params from body: {launch_params}")
        if launch_params and isinstance(launch_params, dict):
            logger.warning(f"DEBUG returning launch_params from body with keys: {list(launch_params.keys())}")
            return launch_params
    
    # Пробуем парсить JSON из request.body для POST запросов
    if request.method == 'POST' and request.body:
        try:
            import json
            body_data = json.loads(request.body.decode('utf-8'))
            logger.warning(f"DEBUG parsed JSON body: {body_data}")
            
            # Ищем launch_params в JSON
            if isinstance(body_data, dict) and 'launch_params' in body_data:
                launch_params = body_data['launch_params']
                logger.warning(f"DEBUG launch_params from JSON body: {launch_params}")
                if isinstance(launch_params, dict):
                    logger.warning(f"DEBUG returning launch_params from JSON with keys: {list(launch_params.keys())}")
                    return launch_params
        except (json.JSONDecodeError, UnicodeDecodeError) as e:
            logger.warning(f"DEBUG failed to parse JSON body: {e}")
    
    # Пробуем получить из query параметров (для GET запросов)
    if request.GET:
        # Собираем все параметры, начинающиеся с vk_ и sign
        params = {}
        for key in request.GET:
            if key.startswith('vk_') or key == 'sign':
                params[key] = request.GET.get(key)
        
        if params:
            logger.warning(f"DEBUG returning params from GET with keys: {list(params.keys())}")
            return params
    
    logger.warning("DEBUG returning None - no launch params found")
    return None


def require_vk_signature(view_func):
    """
    Декоратор для view, требующий валидную VK подпись.
    
    Использование:
        @require_vk_signature
        @api_view(['POST'])
        def my_view(request):
            # request.vk_user_id будет доступен здесь
            ...
    """
    from functools import wraps
    from rest_framework.response import Response
    from rest_framework import status
    
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        launch_params = get_launch_params_from_request(request)
        
        if not launch_params:
            logger.warning(f"VK signature required: no launch params in request from {request.META.get('REMOTE_ADDR')}")
            return Response(
                {
                    'success': False,
                    'error': 'Missing VK launch parameters'
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if not verify_vk_launch_params(launch_params):
            logger.warning(f"VK signature validation failed from IP {request.META.get('REMOTE_ADDR')}")
            return Response(
                {
                    'success': False,
                    'error': 'Invalid VK signature'
                },
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Добавляем проверенные данные в request для использования в view
        request.vk_user_id = launch_params.get('vk_user_id')
        request.vk_app_id = launch_params.get('vk_app_id')
        request.vk_platform = launch_params.get('vk_platform')
        request.launch_params = launch_params
        
        return view_func(request, *args, **kwargs)
    
    return wrapper

