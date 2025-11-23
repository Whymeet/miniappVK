import { useState, useEffect } from 'react';
import { Button, Snackbar, Avatar } from '@vkontakte/vkui';
import {
  Icon28CheckCircleOutline,
  Icon28CancelCircleOutline,
} from '@vkontakte/icons';
import bridge from '@vkontakte/vk-bridge';
import { useAllowMessages, useSubscriptionStatus } from '@/hooks/useSubscription';

interface AllowMessagesButtonProps {
  groupId: string | null;
  userId: string | null;
  launchParams?: Record<string, any>;
}

const VK_ADS_SUBSCRIBE_EVENT_NAME = 'subscribe';

export default function AllowMessagesButton({
  groupId,
  userId,
  launchParams,
}: AllowMessagesButtonProps) {
  const [snackbar, setSnackbar] = useState<React.ReactNode>(null);
  const [isAllowed, setIsAllowed] = useState(false);
  const allowMessagesMutation = useAllowMessages();
  const { data: subscriptionStatus } = useSubscriptionStatus(userId, launchParams);

  // Проверяем статус из базы и из localStorage
  useEffect(() => {
    console.log('AllowMessagesButton: checking subscription status', {
      subscriptionStatus,
      userId,
      isAllowed,
    });

    if (subscriptionStatus?.success && subscriptionStatus.data) {
      const newAllowed = subscriptionStatus.data.allowed_from_group;
      console.log('AllowMessagesButton: setting isAllowed from API:', newAllowed);
      setIsAllowed(newAllowed);
    } else if (userId) {
      const localAllowed = localStorage.getItem(`messages_allowed_${userId}`);
      if (localAllowed === 'true') {
        console.log(
          'AllowMessagesButton: setting isAllowed from localStorage: true',
        );
        setIsAllowed(true);
      }
    }
  }, [subscriptionStatus, userId]);

  const showError = (text: string) => {
    setSnackbar(
      <Snackbar
        onClose={() => setSnackbar(null)}
        before={
          <Avatar size={24}>
            <Icon28CancelCircleOutline fill="var(--vkui--color_icon_negative)" />
          </Avatar>
        }
      >
        {text}
      </Snackbar>,
    );
  };

  const showSuccess = (text: string) => {
    setSnackbar(
      <Snackbar
        onClose={() => setSnackbar(null)}
        before={
          <Avatar size={24}>
            <Icon28CheckCircleOutline fill="var(--vkui--color_icon_positive)" />
          </Avatar>
        }
      >
        {text}
      </Snackbar>,
    );
  };

  const handleAllowMessages = async () => {
    if (!groupId || !userId || !launchParams) {
      console.error('AllowMessagesButton: missing required params', {
        hasGroupId: !!groupId,
        hasUserId: !!userId,
        hasLaunchParams: !!launchParams,
        launchParamsKeys: launchParams ? Object.keys(launchParams) : [],
      });

      showError('Ошибка: данные пользователя не найдены');
      return;
    }

    try {
      console.log(
        'AllowMessagesButton: requesting VKWebAppAllowMessagesFromGroup for group:',
        groupId,
      );

      // 1. Запрашиваем разрешение на сообщения от группы
      const vkResult = await bridge.send('VKWebAppAllowMessagesFromGroup', {
        group_id: parseInt(groupId, 10),
      });
      console.log(
        'AllowMessagesButton: VKWebAppAllowMessagesFromGroup result:',
        vkResult,
      );

      if (!vkResult?.result) {
        console.log('AllowMessagesButton: user declined notifications');
        showError('Вы отключили уведомления. Можно включить позже в настройках.');
        return;
      }

      console.log('AllowMessagesButton: VK notifications allowed, saving to backend');

      // 2. Сохраняем allowed_from_group в базе
      allowMessagesMutation.mutate(
        { launchParams, groupId },
        {
          onSuccess: async (response) => {
            console.log('AllowMessagesButton: backend response', response);

            if (response.success) {
              console.log(
                'AllowMessagesButton: subscription successful, updating state',
              );
              setIsAllowed(true);
              localStorage.setItem(`messages_allowed_${userId}`, 'true');
              showSuccess('Уведомления включены');

              // 3. Отправляем событие подписки в VK Ads
              try {
                const trackResult = await bridge.send('VKWebAppTrackEvent', {
                  event_name: VK_ADS_SUBSCRIBE_EVENT_NAME,
                  user_id: userId,
                  event_params: {
                    group_id: groupId,
                    source: 'allow_messages_button',
                  },
                } as any);
                console.log(
                  'AllowMessagesButton: VK Ads subscribe event sent:',
                  trackResult,
                );
              } catch (trackError) {
                console.warn(
                  'AllowMessagesButton: failed to send VK Ads subscribe event:',
                  trackError,
                );
              }

              // 4. Логируем событие на свой бэкенд
              try {
                const logResp = await fetch('/api/vk-ads/log-event/', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    event_name: VK_ADS_SUBSCRIBE_EVENT_NAME,
                    vk_user_id: userId,
                    event_params: {
                      group_id: groupId,
                      source: 'allow_messages_button',
                    },
                    success: true,
                    error_message: null,
                    platform: 'Web',
                  }),
                });
                console.log(
                  'AllowMessagesButton: backend log subscribe status:',
                  logResp.status,
                );
              } catch (logError) {
                console.warn(
                  'AllowMessagesButton: failed to log subscribe event on backend:',
                  logError,
                );
              }
            } else {
              console.error(
                'AllowMessagesButton: backend returned error',
                response.error,
              );
              showError(
                `Ошибка сервера: ${response.error || 'Неизвестная ошибка'}`,
              );
            }
          },
          onError: (error) => {
            console.error('AllowMessagesButton: backend request failed', error);
            showError(
              'Не удалось сохранить разрешение. Проверьте подключение к интернету.',
            );
          },
        },
      );
    } catch (error: any) {
      console.error(
        'AllowMessagesButton: error during permission request',
        error,
      );
      showError('Не удалось разрешить уведомления');
    }
  };

  // Если уже разрешено — показываем "зелёную" кнопку
  if (isAllowed) {
    return (
      <>
        <Button
          size="l"
          stretched
          mode="secondary"
          onClick={() => {
            showSuccess('Вы уже подписаны на уведомления');
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
          }}
        >
          ✓ Уведомления разрешены
        </Button>
        {snackbar}
      </>
    );
  }

  return (
    <>
      <Button
        size="l"
        stretched
        mode="secondary"
        onClick={handleAllowMessages}
        loading={allowMessagesMutation.isPending}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        Разрешить уведомления
      </Button>
      {snackbar}
    </>
  );
}
