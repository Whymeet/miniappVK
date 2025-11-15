

# ============================================================================
# VK ADS EVENTS LOGGING
# ============================================================================

@ratelimit(key='ip', rate='100/m', method='POST')
@api_view(['POST'])
def log_vk_ads_event_view(request):
    """
    POST /api/vk-ads/log-event/
    
    Логирование событий VK Ads с фронтенда.
    
    Body: {
        event_name: 'lead' | 'subscribe' | 'product_card' | etc,
        vk_user_id: '1060115968',
        event_params: { offer_id: '10', partner_name: 'Webbankir' },
        success: true,
        error_message: null,
        platform: 'iOS' | 'Android' | 'Web'
    }
    """
    from .vk_ads_logger import log_vk_ads_event
    
    data = request.data
    event_name = data.get('event_name')
    vk_user_id = data.get('vk_user_id')
    event_params = data.get('event_params')
    success = data.get('success', True)
    error_message = data.get('error_message')
    platform = data.get('platform')
    
    if not event_name:
        return Response(
            {'success': False, 'error': 'event_name is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Логируем событие
    event = log_vk_ads_event(
        event_name=event_name,
        vk_user_id=vk_user_id,
        event_params=event_params,
        success=success,
        error_message=error_message,
        ip_address=get_client_ip(request),
        user_agent=request.META.get('HTTP_USER_AGENT', ''),
        platform=platform
    )
    
    return Response({
        'success': True,
        'data': {
            'event_id': event.id if event else None,
            'logged': event is not None
        }
    })
