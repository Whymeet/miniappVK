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
  vkUserId: string,
  groupId: string | null,
  brand: string
): Promise<SubscribeResponse> {
  const response = await fetch(`${API_BASE}/api/subscribe/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      vk_user_id: vkUserId,
      group_id: groupId,
      brand,
    }),
  });

  return response.json();
}

/**
 * Обновление статуса после разрешения уведомлений
 */
export async function allowMessages(
  vkUserId: string,
  groupId: string
): Promise<AllowMessagesResponse> {
  const response = await fetch(`${API_BASE}/api/subscribe/allow-messages/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      vk_user_id: vkUserId,
      group_id: groupId,
    }),
  });

  return response.json();
}

/**
 * Отписка от рассылки
 */
export async function unsubscribe(vkUserId: string): Promise<{ success: boolean; error?: string }> {
  const response = await fetch(`${API_BASE}/api/unsubscribe/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      vk_user_id: vkUserId,
    }),
  });

  return response.json();
}

/**
 * Получение статуса подписки
 */
export async function getSubscriptionStatus(
  vkUserId: string
): Promise<{ success: boolean; data: SubscriptionStatus }> {
  const response = await fetch(`${API_BASE}/api/subscription/status/?vk_user_id=${vkUserId}`);
  return response.json();
}

