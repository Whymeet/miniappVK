/**
 * API клиент для работы с подписками
 */
import { API_BASE } from './config';

export interface SubscriptionStatus {
  vk_user_id: string;
  subscribed: boolean;
  allowed_from_group: boolean;
  can_receive_messages: boolean;
  created_at?: string;
  subscribed_at?: string;
  brand?: string;
}

export interface SubscribeResponse {
  success: boolean;
  data?: {
    vk_user_id: string;
    subscribed: boolean;
    allowed_from_group: boolean;
    created: boolean;
  };
  error?: string;
}

export interface AllowMessagesResponse {
  success: boolean;
  data?: {
    vk_user_id: string;
    allowed_from_group: boolean;
    vk_api_confirmed: boolean | null;
  };
  error?: string;
}

/**
 * Подписка пользователя при входе в приложение
 */
export async function subscribe(
  launchParams: Record<string, any>,
  brand: string
): Promise<SubscribeResponse> {
  console.log('API subscribe: sending request', {
    url: `${API_BASE}/subscribe/`,
    hasLaunchParams: !!launchParams,
    launchParamsKeys: Object.keys(launchParams || {}),
    brand
  });

  try {
    const response = await fetch(`${API_BASE}/subscribe/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        launch_params: launchParams,
        brand,
      }),
    });

    console.log('API subscribe: response status', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API subscribe: HTTP error ${response.status}`, errorText);
      return {
        success: false,
        error: `HTTP ${response.status}: ${errorText}`
      };
    }

    const data = await response.json();
    console.log('API subscribe: success', data);
    return data;
  } catch (error) {
    console.error('API subscribe: network error', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error'
    };
  }
}

/**
 * Обновление статуса после разрешения уведомлений
 */
export async function allowMessages(
  launchParams: Record<string, any>,
  groupId: string
): Promise<AllowMessagesResponse> {
  console.log('API allowMessages: sending request', {
    url: `${API_BASE}/subscribe/allow-messages/`,
    hasLaunchParams: !!launchParams,
    launchParamsKeys: Object.keys(launchParams || {}),
    hasSign: 'sign' in (launchParams || {}),
    hasVkUserId: 'vk_user_id' in (launchParams || {}),
    hasVkGroupId: 'vk_group_id' in (launchParams || {}),
    groupId
  });

  try {
    const response = await fetch(`${API_BASE}/subscribe/allow-messages/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        launch_params: launchParams,
        group_id: groupId,
      }),
    });

    console.log('API allowMessages: response status', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API allowMessages: HTTP error ${response.status}`, errorText);
      return {
        success: false,
        error: `HTTP ${response.status}: ${errorText}`
      };
    }

    const data = await response.json();
    console.log('API allowMessages: success', data);
    return data;
  } catch (error) {
    console.error('API allowMessages: network error', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error'
    };
  }
}

/**
 * Отписка от рассылки
 */
export async function unsubscribe(launchParams: Record<string, any>): Promise<{ success: boolean; error?: string }> {
  console.log('API unsubscribe: sending request');
  
  try {
    const response = await fetch(`${API_BASE}/unsubscribe/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        launch_params: launchParams,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API unsubscribe: HTTP error ${response.status}`, errorText);
      return {
        success: false,
        error: `HTTP ${response.status}: ${errorText}`
      };
    }

    return response.json();
  } catch (error) {
    console.error('API unsubscribe: network error', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error'
    };
  }
}

/**
 * Получение статуса подписки
 */
export async function getSubscriptionStatus(
  launchParams: Record<string, any>
): Promise<{ success: boolean; data: SubscriptionStatus; error?: string }> {
  // Передаем параметры запуска через query string для GET запроса
  const params = new URLSearchParams();
  
  // Добавляем все vk_* параметры и sign
  Object.keys(launchParams).forEach(key => {
    if (key.startsWith('vk_') || key === 'sign') {
      params.append(key, String(launchParams[key]));
    }
  });

  console.log('API getSubscriptionStatus: sending request', {
    url: `${API_BASE}/subscription/status/`,
    paramsCount: Array.from(params.keys()).length,
    hasSign: params.has('sign'),
    hasVkUserId: params.has('vk_user_id')
  });
  
  try {
    const response = await fetch(`${API_BASE}/subscription/status/?${params.toString()}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API getSubscriptionStatus: HTTP error ${response.status}`, errorText);
      return {
        success: false,
        error: `HTTP ${response.status}`,
        data: {
          vk_user_id: '',
          subscribed: false,
          allowed_from_group: false,
          can_receive_messages: false,
        }
      };
    }
    
    const data = await response.json();
    console.log('API getSubscriptionStatus: success', data);
    return data;
  } catch (error) {
    console.error('API getSubscriptionStatus: network error', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
      data: {
        vk_user_id: '',
        subscribed: false,
        allowed_from_group: false,
        can_receive_messages: false,
      }
    };
  }
}

