import { useMemo } from 'react';
import { LaunchParams } from '@/types';

/**
 * Хук для получения параметров запуска VK Mini App
 */
export function useLaunchParams(): LaunchParams {
  return useMemo(() => {
    try {
      // Получаем параметры из URL
      const urlParams = new URLSearchParams(window.location.search);
      const hash = window.location.hash;
      const hashParams = new URLSearchParams(hash.split('?')[1] || '');
      
      // Проверяем оба источника параметров
      const groupId = urlParams.get('vk_group_id') || hashParams.get('vk_group_id');
      const userId = urlParams.get('vk_user_id') || hashParams.get('vk_user_id');
      const brand = urlParams.get('brand') || hashParams.get('brand');
      
      return {
        groupId: groupId,
        userId: userId,
        brand: brand,
      };
    } catch (error) {
      console.error('Failed to parse launch params:', error);
      
      return {
        groupId: null,
        userId: null,
        brand: null,
      };
    }
  }, []);
}

