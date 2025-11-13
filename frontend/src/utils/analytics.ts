import bridge from '@vkontakte/vk-bridge';

/**
 * Отслеживание просмотра карточки товара (оффера)
 * @param offerId - ID оффера
 * @param vkUserId - VK User ID (опционально)
 */
export async function trackProductView(
  offerId: string,
  vkUserId?: string | null
): Promise<void> {
  try {
    const params: { event_name: string; user_id?: string } = {
      event_name: 'product_card',
    };

    if (vkUserId) {
      params.user_id = vkUserId;
    }

    await bridge.send('VKWebAppTrackEvent', params);

    console.log('✅ VK Ads: product_card', { offerId, vkUserId });
  } catch (error) {
    console.error('❌ VK Ads track error:', error);
  }
}

/**
 * Отслеживание клика по офферу (добавление в корзину)
 * @param offerId - ID оффера
 * @param vkUserId - VK User ID (опционально)
 */
export async function trackOfferClick(
  offerId: string,
  vkUserId?: string | null
): Promise<void> {
  try {
    const params: { event_name: string; user_id?: string } = {
      event_name: 'add_to_cart',
    };

    if (vkUserId) {
      params.user_id = vkUserId;
    }

    await bridge.send('VKWebAppTrackEvent', params);

    console.log('✅ VK Ads: add_to_cart', { offerId, vkUserId });
  } catch (error) {
    console.error('❌ VK Ads track error:', error);
  }
}

/**
 * Отслеживание оформления заявки (лид)
 * @param offerId - ID оффера
 * @param vkUserId - VK User ID (опционально)
 */
export async function trackLead(
  offerId: string,
  vkUserId?: string | null
): Promise<void> {
  try {
    const params: { event_name: string; user_id?: string } = {
      event_name: 'lead',
    };

    if (vkUserId) {
      params.user_id = vkUserId;
    }

    await bridge.send('VKWebAppTrackEvent', params);

    console.log('✅ VK Ads: lead', { offerId, vkUserId });
  } catch (error) {
    console.error('❌ VK Ads track error:', error);
  }
}

/**
 * Отслеживание подписки на рассылку
 * @param vkUserId - VK User ID (опционально)
 */
export async function trackSubscribe(vkUserId?: string | null): Promise<void> {
  try {
    const params: { event_name: string; user_id?: string } = {
      event_name: 'subscribe',
    };

    if (vkUserId) {
      params.user_id = vkUserId;
    }

    await bridge.send('VKWebAppTrackEvent', params);

    console.log('✅ VK Ads: subscribe', { vkUserId });
  } catch (error) {
    console.error('❌ VK Ads track error:', error);
  }
}

/**
 * Отслеживание посещения сайта (переход по ссылке оффера)
 * @param offerId - ID оффера
 * @param vkUserId - VK User ID (опционально)
 */
export async function trackVisitWebsite(
  offerId: string,
  vkUserId?: string | null
): Promise<void> {
  try {
    const params: { event_name: string; user_id?: string } = {
      event_name: 'visit_website',
    };

    if (vkUserId) {
      params.user_id = vkUserId;
    }

    await bridge.send('VKWebAppTrackEvent', params);

    console.log('✅ VK Ads: visit_website', { offerId, vkUserId });
  } catch (error) {
    console.error('❌ VK Ads track error:', error);
  }
}
