/**
 * React Query хук для работы с подписками
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  subscribe,
  allowMessages,
  unsubscribe,
  getSubscriptionStatus,
  SubscriptionStatus,
} from '@/api/subscription';

/**
 * Хук для получения статуса подписки
 */
export function useSubscriptionStatus(vkUserId: string | null) {
  return useQuery({
    queryKey: ['subscription', vkUserId],
    queryFn: () => getSubscriptionStatus(vkUserId!),
    enabled: !!vkUserId,
    staleTime: 5 * 60 * 1000, // 5 минут
  });
}

/**
 * Хук для подписки пользователя
 */
export function useSubscribe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      vkUserId,
      groupId,
      brand,
    }: {
      vkUserId: string;
      groupId: string | null;
      brand: string;
    }) => subscribe(vkUserId, groupId, brand),
    onSuccess: (data) => {
      if (data.success && data.data) {
        // Обновляем кеш статуса подписки
        queryClient.setQueryData(['subscription', data.data.vk_user_id], {
          success: true,
          data: {
            vk_user_id: data.data.vk_user_id,
            subscribed: data.data.subscribed,
            allowed_from_group: data.data.allowed_from_group,
            can_receive_messages: data.data.subscribed && data.data.allowed_from_group,
          } as SubscriptionStatus,
        });
      }
    },
  });
}

/**
 * Хук для разрешения сообщений
 */
export function useAllowMessages() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ vkUserId, groupId }: { vkUserId: string; groupId: string }) =>
      allowMessages(vkUserId, groupId),
    onSuccess: (data) => {
      if (data.success && data.data) {
        // Обновляем кеш
        queryClient.invalidateQueries({ queryKey: ['subscription', data.data.vk_user_id] });
      }
    },
  });
}

/**
 * Хук для отписки
 */
export function useUnsubscribe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vkUserId: string) => unsubscribe(vkUserId),
    onSuccess: (_, vkUserId) => {
      // Обновляем кеш
      queryClient.invalidateQueries({ queryKey: ['subscription', vkUserId] });
    },
  });
}

