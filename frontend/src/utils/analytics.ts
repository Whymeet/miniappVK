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
    const params: { 
      event_name: string; 
      custom_user_id?: string;
      event_params?: Record<string, string | number>;
    } = {
      event_name: 'product_card',
      event_params: {
        offer_id: offerId,
      }
    };

    if (vkUserId) {
      params.custom_user_id = vkUserId;
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
    const params: { 
      event_name: string; 
      custom_user_id?: string;
      event_params?: Record<string, string | number>;
    } = {
      event_name: 'add_to_cart',
      event_params: {
        offer_id: offerId,
      }
    };

    if (vkUserId) {
      params.custom_user_id = vkUserId;
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
    const params: { 
      event_name: string; 
      custom_user_id?: string;
      event_params?: Record<string, string | number>;
    } = {
      event_name: 'lead',
      event_params: {
        offer_id: offerId,
      }
    };

    if (vkUserId) {
      params.custom_user_id = vkUserId;
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
    const params: { 
      event_name: string; 
      custom_user_id?: string;
    } = {
      event_name: 'subscribe',
    };

    if (vkUserId) {
      params.custom_user_id = vkUserId;
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
    const params: { 
      event_name: string; 
      custom_user_id?: string;
      event_params?: Record<string, string | number>;
    } = {
      event_name: 'visit_website',
      event_params: {
        offer_id: offerId,
      }
    };

    if (vkUserId) {
      params.custom_user_id = vkUserId;
    }

    await bridge.send('VKWebAppTrackEvent', params);

    console.log('✅ VK Ads: visit_website', { offerId, vkUserId });
  } catch (error) {
    console.error('❌ VK Ads track error:', error);
  }
}
