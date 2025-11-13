import bridge from '@vkontakte/vk-bridge';

/**
 * Отслеживание клика по офферу через VK Analytics
 * @param offerId - ID оффера
 * @param offerTitle - Название оффера
 * @param position - Позиция карточки в списке (0-indexed)
 * @param vkUserId - VK User ID (опционально)
 */
export async function trackOfferClick(
  offerId: string,
  offerTitle: string,
  position: number,
  vkUserId?: string | null
): Promise<void> {
  try {
    const eventParams: Record<string, string | number> = {
      offer_id: offerId,
      offer_title: offerTitle,
      position: position,
    };

    // Добавляем vk_user_id если доступен
    if (vkUserId) {
      eventParams.custom_user_id = vkUserId;
    }

    // Отправляем событие через VK Bridge
    await bridge.send('VKWebAppTrackEvent', {
      event_name: 'offer_click',
      event_params: eventParams,
    });

    console.log('Tracked offer click:', {
      event_name: 'offer_click',
      event_params: eventParams,
    });
  } catch (error) {
    console.error('Failed to track offer click:', error);
  }
}
