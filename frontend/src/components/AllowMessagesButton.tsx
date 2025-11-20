import { useState, useEffect } from 'react';
import { Button, Snackbar, Avatar } from '@vkontakte/vkui';
import { Icon28CheckCircleOutline, Icon28CancelCircleOutline } from '@vkontakte/icons';
import bridge from '@vkontakte/vk-bridge';
import { useAllowMessages, useSubscriptionStatus } from '@/hooks/useSubscription';

interface AllowMessagesButtonProps {
  groupId: string | null;
  userId: string | null;
  launchParams?: Record<string, any>;
}

export default function AllowMessagesButton({ groupId, userId, launchParams }: AllowMessagesButtonProps) {
  const [snackbar, setSnackbar] = useState<React.ReactNode>(null);
  const [isAllowed, setIsAllowed] = useState(false);
  const allowMessagesMutation = useAllowMessages();
  const { data: subscriptionStatus } = useSubscriptionStatus(userId, launchParams);

  // Проверяем статус из базы данных и localStorage
  useEffect(() => {
    console.log('AllowMessagesButton: checking subscription status', {
      subscriptionStatus,
      userId,
      isAllowed
    });
    
    if (subscriptionStatus?.success && subscriptionStatus.data) {
      const newAllowed = subscriptionStatus.data.allowed_from_group;
      console.log('AllowMessagesButton: setting isAllowed from API:', newAllowed);
      setIsAllowed(newAllowed);
    } else if (userId) {
      // Проверяем localStorage как fallback
      const localAllowed = localStorage.getItem(`messages_allowed_${userId}`);
      if (localAllowed === 'true') {
        console.log('AllowMessagesButton: setting isAllowed from localStorage: true');
        setIsAllowed(true);
      }
    }
  }, [subscriptionStatus, userId]);

  const handleAllowMessages = async () => {
    if (!groupId || !userId || !launchParams) {
      console.error('AllowMessagesButton: missing required params', {
        hasGroupId: !!groupId,
        hasUserId: !!userId,
        hasLaunchParams: !!launchParams,
        launchParamsKeys: launchParams ? Object.keys(launchParams) : []
      });
      
      setSnackbar(
        <Snackbar
          onClose={() => setSnackbar(null)}
          before={<Avatar size={24}><Icon28CancelCircleOutline fill="var(--vkui--color_icon_negative)" /></Avatar>}
        >
          Ошибка: данные пользователя не найдены
        </Snackbar>
      );
      return;
    }

    try {
      console.log('AllowMessagesButton: saving notification permission');

      // Просто сохраняем в базу данных
      allowMessagesMutation.mutate(
        { launchParams, groupId },
        {
          onSuccess: async (response) => {
            console.log('AllowMessagesButton: backend response', response);
            
            if (response.success) {
              console.log('AllowMessagesButton: subscription successful, updating state');
              setIsAllowed(true);
              localStorage.setItem(`messages_allowed_${userId}`, 'true');
              
              // Отправляем событие в VK Ads и MyTracker для отслеживания конверсии
              try {
                const trackResult = await bridge.send('VKWebAppTrackEvent', {
                  event_name: 'subscribe',
                  user_id: userId,
                } as any);
                console.log('✅ VK Ads tracking event sent:', trackResult);
              } catch (trackError) {
                console.warn('⚠️ Failed to send VK Ads tracking event:', trackError);
                // Не показываем ошибку пользователю, т.к. это не критично
              }
            } else {
              console.error('AllowMessagesButton: backend returned error', response.error);
              setSnackbar(
                <Snackbar
                  onClose={() => setSnackbar(null)}
                  before={<Avatar size={24}><Icon28CancelCircleOutline fill="var(--vkui--color_icon_negative)" /></Avatar>}
                >
                  Ошибка сервера: {response.error || 'Неизвестная ошибка'}
                </Snackbar>
              );
            }
          },
          onError: (error) => {
            console.error('AllowMessagesButton: backend request failed', error);
            setSnackbar(
              <Snackbar
                onClose={() => setSnackbar(null)}
                before={<Avatar size={24}><Icon28CancelCircleOutline fill="var(--vkui--color_icon_negative)" /></Avatar>}
              >
                Не удалось сохранить разрешение. Проверьте подключение к интернету.
              </Snackbar>
            );
          },
        }
      );

    } catch (error: any) {
      console.error('AllowMessagesButton: error during permission request', error);
      setSnackbar(
        <Snackbar
          onClose={() => setSnackbar(null)}
          before={<Avatar size={24}><Icon28CancelCircleOutline fill="var(--vkui--color_icon_negative)" /></Avatar>}
        >
          Не удалось разрешить уведомления
        </Snackbar>
      );
    }
  };

  // Если уже разрешено, показываем кнопку отписки
  if (isAllowed) {
    return (
      <>
        <Button
          size="l"
          stretched
          mode="secondary"
          onClick={() => {
            // TODO: Реализовать функционал отписки позже
            setSnackbar(
              <Snackbar
                onClose={() => setSnackbar(null)}
                before={<Avatar size={24}><Icon28CheckCircleOutline fill="var(--vkui--color_icon_positive)" /></Avatar>}
              >
                Вы уже подписаны на уведомления
              </Snackbar>
            );
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center'
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
          textAlign: 'center'
        }}
      >
        Разрешить уведомления
      </Button>
      {snackbar}
    </>
  );
}

