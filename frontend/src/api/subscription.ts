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
  const response = await fetch(`${API_BASE}/api/subscribe/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      launch_params: launchParams,  // Отправляем все параметры с подписью
      brand,
    }),
  });

  return response.json();
}

/**
 * Обновление статуса после разрешения уведомлений
 */
export async function allowMessages(
  launchParams: Record<string, any>,
  groupId: string
): Promise<AllowMessagesResponse> {
  const response = await fetch(`${API_BASE}/api/subscribe/allow-messages/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      launch_params: launchParams,  // Отправляем все параметры с подписью
      group_id: groupId,
    }),
  });

  return response.json();
}

/**
 * Отписка от рассылки
 */
export async function unsubscribe(launchParams: Record<string, any>): Promise<{ success: boolean; error?: string }> {
  const response = await fetch(`${API_BASE}/api/unsubscribe/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      launch_params: launchParams,  // Отправляем все параметры с подписью
    }),
  });

  return response.json();
}

/**
 * Получение статуса подписки
 */
export async function getSubscriptionStatus(
  launchParams: Record<string, any>
): Promise<{ success: boolean; data: SubscriptionStatus }> {
  // Передаем параметры запуска через query string для GET запроса
  const params = new URLSearchParams();
  
  // Добавляем все vk_* параметры и sign
  Object.keys(launchParams).forEach(key => {
    if (key.startsWith('vk_') || key === 'sign') {
      params.append(key, String(launchParams[key]));
    }
  });
  
  const response = await fetch(`${API_BASE}/api/subscription/status/?${params.toString()}`);
  return response.json();
}

