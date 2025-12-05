import { useEffect, useState } from 'react';
import { Button, Title, Text, Spacing, Snackbar, Avatar } from '@vkontakte/vkui';
import './SubscribeModal.css';
import { Icon56NotificationOutline } from '@vkontakte/icons';
import { Icon28CancelCircleOutline } from '@vkontakte/icons';
import bridge from '@vkontakte/vk-bridge';
import { useAllowMessages, useSubscriptionStatus, useSubscribe } from '@/hooks/useSubscription';

interface SubscribeModalProps {
  groupId: string | null;
  userId: string | null;
  launchParams?: Record<string, any>;
  brand?: string | null;
  onClose: () => void;
}

const VK_ADS_SUBSCRIBE_EVENT_NAME = 'subscribe';

export default function SubscribeModal({
  groupId,
  userId,
  launchParams,
  brand,
  onClose,
}: SubscribeModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<React.ReactNode>(null);
  const allowMessagesMutation = useAllowMessages();
  const subscribeMutation = useSubscribe();
  const { data: subscriptionStatus } = useSubscriptionStatus(userId, launchParams);

  // Проверяем, уже ли разрешены уведомления
  useEffect(() => {
    if (subscriptionStatus?.data?.allowed_from_group) {
      console.log('SubscribeModal: user already subscribed, but keeping modal open');
    }
  }, [subscriptionStatus]);

  const handleSubscribe = async () => {
    console.log('SubscribeModal: handleSubscribe called', { groupId, userId, launchParams });

    if (!userId || !launchParams) {
      console.error('SubscribeModal: missing required params', {
        hasGroupId: !!groupId,
        hasUserId: !!userId,
        hasLaunchParams: !!launchParams,
      });
      setSnackbar(
        <Snackbar
          onClose={() => setSnackbar(null)}
          before={
            <Avatar size={24}>
              <Icon28CancelCircleOutline />
            </Avatar>
          }
        >
          Ошибка: данные пользователя не найдены
        </Snackbar>
      );
      return;
    }

    setIsLoading(true);

    try {
      // Создаем запись подписчика перед запросом разрешения сообщений
      if (launchParams && !subscriptionStatus?.data?.subscribed) {
        console.log('SubscribeModal: creating subscriber before allowing messages');

        const subscribeResult = await subscribeMutation.mutateAsync({
          launchParams,
          brand: brand || 'default',
        });

        if (!subscribeResult.success) {
          console.error('SubscribeModal: subscribe mutation failed', subscribeResult.error);
          throw new Error(subscribeResult.error || 'Не удалось создать подписку');
        }
      }

      if (groupId) {
        console.log(
          'SubscribeModal: requesting VKWebAppAllowMessagesFromGroup for group:',
          groupId,
        );

        // 1. Запрашиваем разрешение на сообщения от группы
        const vkResult = await bridge.send('VKWebAppAllowMessagesFromGroup', {
          group_id: parseInt(groupId, 10),
        });
        console.log('SubscribeModal: VKWebAppAllowMessagesFromGroup result:', vkResult);

        if (!vkResult?.result) {
          console.log('SubscribeModal: user declined notifications');
          setSnackbar(
            <Snackbar
              onClose={() => setSnackbar(null)}
              before={
                <Avatar size={24}>
                  <Icon28CancelCircleOutline />
                </Avatar>
              }
            >
              Вы отключили уведомления. Вы можете включить их позже в настройках.
            </Snackbar>
          );
          setIsLoading(false);
          return;
        }

        console.log('SubscribeModal: VK notifications allowed, saving subscription to backend');

        // 2. Сохраняем флаг подписки в базе
        const backendResult = await allowMessagesMutation.mutateAsync({
          launchParams,
          groupId,
        });

        if (!backendResult.success) {
          console.error('SubscribeModal: backend error:', backendResult.error);
          throw new Error(backendResult.error || 'Не удалось сохранить подписку');
        }

        console.log('SubscribeModal: subscription saved successfully');

        // 3. Шлём событие подписки в VK Ads
        try {
          const trackResult = await bridge.send('VKWebAppTrackEvent', {
            event_name: VK_ADS_SUBSCRIBE_EVENT_NAME,
            user_id: userId,
            event_params: {
              group_id: groupId,
              source: 'subscribe_modal',
            },
          } as any);
          console.log('SubscribeModal: VK Ads subscribe event sent:', trackResult);
        } catch (trackError) {
          console.warn(
            'SubscribeModal: failed to send VK Ads subscribe event:',
            trackError,
          );
        }

        // 4. Логируем событие на свой бэкенд (для аналитики)
        try {
          await fetch('/api/vk-ads/log-event/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              event_name: VK_ADS_SUBSCRIBE_EVENT_NAME,
              vk_user_id: userId,
              event_params: {
                group_id: groupId,
                source: 'subscribe_modal',
              },
              success: true,
              error_message: null,
              platform: 'Web',
            }),
          });
          console.log('SubscribeModal: subscribe event logged to backend');
        } catch (logError) {
          console.warn(
            'SubscribeModal: failed to log subscribe event on backend:',
            logError,
          );
        }
      } else {
        // Вариант, если groupId не передан — просто сохраняем подписку и шлём событие
        console.log('SubscribeModal: no groupId, saving subscription without explicit group');

        const backendResult = await allowMessagesMutation.mutateAsync({
          launchParams,
          groupId: '',
        });

        if (!backendResult.success) {
          console.error('SubscribeModal: backend error (no groupId):', backendResult.error);
          throw new Error(backendResult.error || 'Не удалось сохранить подписку');
        }

        console.log('SubscribeModal: subscription saved (no groupId)');

        try {
          const trackResult = await bridge.send('VKWebAppTrackEvent', {
            event_name: VK_ADS_SUBSCRIBE_EVENT_NAME,
            user_id: userId,
            event_params: {
              source: 'subscribe_modal_no_group',
            },
          } as any);
          console.log(
            'SubscribeModal: VK Ads subscribe event (no groupId) sent:',
            trackResult,
          );
        } catch (trackError) {
          console.warn(
            'SubscribeModal: failed to send VK Ads subscribe event (no groupId):',
            trackError,
          );
        }

        try {
          await fetch('/api/vk-ads/log-event/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              event_name: VK_ADS_SUBSCRIBE_EVENT_NAME,
              vk_user_id: userId,
              event_params: {
                source: 'subscribe_modal_no_group',
              },
              success: true,
              error_message: null,
              platform: 'Web',
            }),
          });
          console.log(
            'SubscribeModal: subscribe event (no groupId) logged to backend',
          );
        } catch (logError) {
          console.warn(
            'SubscribeModal: failed to log subscribe event (no groupId) on backend:',
            logError,
          );
        }
      }

      onClose();
      } catch (error: any) {
    console.error('SubscribeModal: failed to allow messages RAW:', error);

    if (error?.error_data) {
      console.error(
        'VK error_data:',
        JSON.stringify(error.error_data, null, 2),
      );
    }

    const errorMessage =
      error?.error_data?.error_reason ||
      (error instanceof Error ? error.message : 'Произошла ошибка при подписке');

    setSnackbar(
      <Snackbar
        onClose={() => setSnackbar(null)}
        before={
          <Avatar size={24}>
            <Icon28CancelCircleOutline />
          </Avatar>
        }
      >
        {`Ошибка при разрешении уведомлений: ${errorMessage}`}
      </Snackbar>
    );
    onClose();
  } finally {
    setIsLoading(false);
  }
};


  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="custom-modal-overlay" onClick={handleOverlayClick}>
      <div className="custom-modal-container">
        <div className="custom-modal-card">
          <button
            className="custom-modal-close"
            onClick={onClose}
            aria-label="Закрыть"
          >
            ✕
          </button>

          <div className="custom-modal-header">
            <h2>Эксклюзивное предложение</h2>
          </div>

          <div className="custom-modal-content">
            <Icon56NotificationOutline className="custom-modal-icon" />

            <Spacing size={16} />

            <Title level="2" weight="2" className="custom-modal-title">
              ЭКСКЛЮЗИВНОЕ ПРЕДЛОЖЕНИЕ
            </Title>

            <Spacing size={12} />

            <Text className="custom-modal-subtitle">
              Ваш первый займ под 0%
            </Text>

            <Spacing size={8} />

            <Text className="custom-modal-description">
              {groupId
                ? 'Получите мгновенные уведомления, чтобы первыми ловить самые выгодные предложения и эксклюзивные условия по займам'
                : 'Зарегистрируйтесь в нашем сервисе, чтобы получить доступ к лучшим предложениям по займам'}
            </Text>

            <Spacing size={24} />

            <Button
              size="l"
              stretched
              mode="primary"
              onClick={handleSubscribe}
              loading={isLoading}
              className="custom-modal-primary-button"
            >
              {groupId ? '🔔 Разрешить уведомления' : '✅ Разрешить уведомления'}
            </Button>

            <Spacing size={12} />

            <Button
              size="l"
              stretched
              mode="tertiary"
              onClick={onClose}
              disabled={isLoading}
            >
              Закрыть
            </Button>
          </div>
        </div>
      </div>
      {snackbar}
    </div>
  );
}
