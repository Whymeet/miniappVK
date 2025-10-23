import { useMemo } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { LaunchParams } from '@/types';

/**
 * Хук для получения параметров запуска VK Mini App
 */
export function useLaunchParams(): LaunchParams {
  return useMemo(() => {
    try {
      // Пробуем получить параметры через VK Bridge
      const launchParams = bridge.parseURLSearchParamsForGetLaunchParams(window.location.search);
      
      // Проверяем query параметры для оверрайда
      const urlParams = new URLSearchParams(window.location.search);
      const brandOverride = urlParams.get('brand');
      
      return {
        groupId: launchParams?.vk_group_id?.toString() || null,
        userId: launchParams?.vk_user_id?.toString() || null,
        brand: brandOverride || null,
      };
    } catch (error) {
      console.error('Failed to parse launch params:', error);
      
      // Fallback: пробуем получить из query параметров напрямую
      const urlParams = new URLSearchParams(window.location.search);
      return {
        groupId: urlParams.get('vk_group_id'),
        userId: urlParams.get('vk_user_id'),
        brand: urlParams.get('brand'),
      };
    }
  }, []);
}

