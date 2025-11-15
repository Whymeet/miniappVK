import bridge from '@vkontakte/vk-bridge';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'https://kybyshka-dev.ru';

/**
 * Отправить событие VK Ads и залогировать на бэкенде
 */
export async function trackAndLogEvent(
  eventName: string,
  vkUserId: string | null | undefined,
  eventParams?: Record<string, any>
): Promise<void> {
  try {
    // Отправляем через VK Bridge
    const result = await bridge.send('VKWebAppTrackEvent', {
      event_name: eventName,
      user_id: vkUserId || undefined,
      event_params: eventParams,
    } as any);
    
    console.log(`📊 VK Ads Event: ${eventName}`, {
      vkUserId,
      eventParams,
      result,
      timestamp: new Date().toISOString()
    });
    
    // Логируем на бэкенд
    try {
      await axios.post(`${API_BASE}/api/vk-ads/log-event/`, {
        event_name: eventName,
        vk_user_id: vkUserId,
        event_params: eventParams,
        success: result.result === true,
        platform: detectPlatform(),
      });
      
      console.log(`✅ Backend logged: ${eventName}`);
    } catch (backendError) {
      console.warn('⚠️ Failed to log to backend:', backendError);
      // Не критично, продолжаем
    }
    
    if (result.result) {
      console.log(`✅ VK Ads confirmed: ${eventName} delivered successfully`);
    } else {
      console.warn(`⚠️ VK Ads: ${eventName} may not be delivered`, result);
    }
  } catch (error) {
    console.error(`❌ VK Ads ERROR: ${eventName}`, error);
    
    // Логируем ошибку на бэкенд
    try {
      await axios.post(`${API_BASE}/api/vk-ads/log-event/`, {
        event_name: eventName,
        vk_user_id: vkUserId,
        event_params: eventParams,
        success: false,
        error_message: error instanceof Error ? error.message : String(error),
        platform: detectPlatform(),
      });
    } catch (backendError) {
      console.warn('⚠️ Failed to log error to backend:', backendError);
    }
  }
}

/**
 * Определить платформу пользователя
 */
function detectPlatform(): string {
  const ua = navigator.userAgent.toLowerCase();
  
  if (ua.includes('iphone') || ua.includes('ipad')) {
    return 'iOS';
  } else if (ua.includes('android')) {
    return 'Android';
  } else if (ua.includes('mobile')) {
    return 'Mobile Web';
  } else {
    return 'Web';
  }
}
