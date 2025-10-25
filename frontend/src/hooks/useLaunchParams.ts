import { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { LaunchParams } from '@/types';

/**
 * Хук для получения параметров запуска VK Mini App через VK Bridge
 * Получает параметры с подписью для безопасной передачи на backend
 */
export function useLaunchParams(): LaunchParams & { rawParams?: Record<string, any> } {
  const [launchParams, setLaunchParams] = useState<LaunchParams & { rawParams?: Record<string, any> }>({
    groupId: null,
    userId: null,
    brand: null,
    rawParams: undefined,
  });

  useEffect(() => {
    const fetchLaunchParams = async () => {
      try {
        // Получаем параметры запуска через VK Bridge (включая подпись!)
        const params = await bridge.send('VKWebAppGetLaunchParams');
        
        console.log('VK Launch Params received:', params);
        
        // Извлекаем нужные данные
        const groupId = params.vk_group_id || null;
        const userId = params.vk_user_id ? String(params.vk_user_id) : null;
        
        // Получаем brand из URL параметров (если передан)
        const urlParams = new URLSearchParams(window.location.search);
        const brand = urlParams.get('brand');
        
        setLaunchParams({
          groupId: groupId ? String(groupId) : null,
          userId,
          brand,
          rawParams: params, // Сохраняем все параметры включая подпись
        });
      } catch (error) {
        console.error('Failed to get VK launch params:', error);
        
        // Fallback: пробуем получить из URL (для разработки)
        try {
          const urlParams = new URLSearchParams(window.location.search);
          const hash = window.location.hash;
          const hashParams = new URLSearchParams(hash.split('?')[1] || '');
          
          const groupId = urlParams.get('vk_group_id') || hashParams.get('vk_group_id');
          const userId = urlParams.get('vk_user_id') || hashParams.get('vk_user_id');
          const brand = urlParams.get('brand') || hashParams.get('brand');
          
          setLaunchParams({
            groupId,
            userId,
            brand,
            rawParams: undefined,
          });
        } catch (fallbackError) {
          console.error('Fallback also failed:', fallbackError);
        }
      }
    };

    fetchLaunchParams();
  }, []);

  return launchParams;
}

