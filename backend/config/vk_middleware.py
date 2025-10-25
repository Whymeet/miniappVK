"""
Middleware для автоматической проверки VK подписи на защищенных эндпоинтах.
"""
import logging
from django.http import JsonResponse
from app.vk_security import verify_vk_launch_params, get_launch_params_from_request

logger = logging.getLogger(__name__)


class VKSignatureMiddleware:
    """
    Middleware для проверки VK подписи на определенных эндпоинтах.
    
    Защищенные эндпоинты (требуют валидную VK подпись):
    - /api/subscribe/
    - /api/unsubscribe/
    - /api/subscribe/allow-messages/
    - /api/subscription/status/
    """
    
    # Эндпоинты, требующие проверки VK подписи
    PROTECTED_PATHS = [
        '/api/subscribe/',
        '/api/subscribe/allow-messages/',
        '/api/unsubscribe/',
        '/api/subscription/status/',
    ]
    
    # Эндпоинты, НЕ требующие проверки (публичные API)
    PUBLIC_PATHS = [
        '/api/config/',
        '/api/offers/',
        '/api/health/',
        '/admin/',
        '/static/',
        '/media/',
    ]
    
    def __init__(self, get_response):
        self.get_response = get_response
    
    def __call__(self, request):
        # Проверяем, требуется ли проверка подписи для этого пути
        if self._requires_signature_check(request.path):
            # Извлекаем launch параметры
            launch_params = get_launch_params_from_request(request)
            
            if not launch_params:
                logger.warning(
                    f"VK signature check: missing launch params for {request.path} "
                    f"from IP {self._get_client_ip(request)}"
                )
                return JsonResponse(
                    {
                        'success': False,
                        'error': 'Missing VK launch parameters. Please provide launch_params.'
                    },
                    status=400
                )
            
            # Проверяем подпись
            if not verify_vk_launch_params(launch_params):
                logger.warning(
                    f"VK signature validation failed for {request.path} "
                    f"from IP {self._get_client_ip(request)}"
                )
                return JsonResponse(
                    {
                        'success': False,
                        'error': 'Invalid VK signature. Request rejected.'
                    },
                    status=403
                )
            
            # Добавляем проверенные данные в request
            request.vk_user_id = launch_params.get('vk_user_id')
            request.vk_app_id = launch_params.get('vk_app_id')
            request.vk_platform = launch_params.get('vk_platform')
            request.launch_params = launch_params
            request.vk_signature_verified = True
            
            logger.info(
                f"VK signature verified for user {request.vk_user_id} "
                f"on {request.path}"
            )
        
        response = self.get_response(request)
        return response
    
    def _requires_signature_check(self, path: str) -> bool:
        """Проверяет, требуется ли проверка подписи для данного пути."""
        # Сначала проверяем публичные пути
        for public_path in self.PUBLIC_PATHS:
            if path.startswith(public_path):
                return False
        
        # Затем проверяем защищенные пути
        for protected_path in self.PROTECTED_PATHS:
            if path.startswith(protected_path):
                return True
        
        return False
    
    def _get_client_ip(self, request):
        """Получает IP адрес клиента."""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0].strip()
        else:
            ip = request.META.get('REMOTE_ADDR', 'unknown')
        return ip

