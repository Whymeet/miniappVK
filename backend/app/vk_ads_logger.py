"""
Утилиты для логирования событий VK Ads
"""
import logging
from .models import VKAdsEvent

logger = logging.getLogger(__name__)


def log_vk_ads_event(
    event_name: str,
    vk_user_id: str = None,
    event_params: dict = None,
    success: bool = True,
    error_message: str = None,
    ip_address: str = None,
    user_agent: str = None,
    platform: str = None
):
    """
    Логирует событие VK Ads в базу данных и файл логов
    
    Args:
        event_name: Тип события (lead, subscribe, product_card и т.д.)
        vk_user_id: ID пользователя VK
        event_params: Параметры события (offer_id, partner_name и др.)
        success: Успешно ли отправлено событие
        error_message: Сообщение об ошибке
        ip_address: IP адрес клиента
        user_agent: User Agent
        platform: Платформа (iOS, Android, Web)
    """
    try:
        # Сохраняем в БД
        event = VKAdsEvent.objects.create(
            event_name=event_name,
            vk_user_id=vk_user_id,
            event_params=event_params,
            success=success,
            error_message=error_message,
            ip_address=ip_address,
            user_agent=user_agent,
            platform=platform
        )
        
        # Логируем в файл
        log_msg = f"VK_ADS_EVENT | {event_name} | User: {vk_user_id}"
        if event_params:
            log_msg += f" | Params: {event_params}"
        if not success and error_message:
            log_msg += f" | ERROR: {error_message}"
        
        if success:
            logger.info(log_msg)
        else:
            logger.error(log_msg)
            
        return event
        
    except Exception as e:
        logger.error(f"Failed to log VK Ads event: {e}")
        return None
