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
      console.log('AllowMessagesButton: requesting messages permission', {
        groupId,
        userId,
        hasSign: 'sign' in launchParams
      });

      // Пробуем сначала VKWebAppAllowMessagesFromGroup
      let result;
      let permissionGranted = false;
      
      try {
        result = await bridge.send('VKWebAppAllowMessagesFromGroup', {
          group_id: parseInt(groupId),
        });
        
        console.log('VKWebAppAllowMessagesFromGroup result:', result);
        permissionGranted = result.result === true;
      } catch (bridgeError: any) {
        console.warn('VKWebAppAllowMessagesFromGroup failed, trying VKWebAppAllowNotifications:', bridgeError);
        
        // Если не получилось через Messages, пробуем через Notifications
        try {
          const notifResult = await bridge.send('VKWebAppAllowNotifications');
          console.log('VKWebAppAllowNotifications result:', notifResult);
          permissionGranted = notifResult.result === true;
        } catch (notifError) {
          console.error('VKWebAppAllowNotifications also failed:', notifError);
          throw bridgeError; // Возвращаем исходную ошибку
        }
      }
      
      if (permissionGranted) {
        // Сохраняем разрешение в базу данных
        console.log('AllowMessagesButton: saving to backend', {
          groupId,
          userId,
          launchParamsKeys: Object.keys(launchParams)
        });
        
        allowMessagesMutation.mutate(
          { launchParams, groupId },
          {
            onSuccess: (response) => {
              console.log('AllowMessagesButton: backend response', response);
              
              if (response.success) {
                console.log('AllowMessagesButton: subscription successful, updating state');
                setIsAllowed(true);
                localStorage.setItem(`messages_allowed_${userId}`, 'true');
                
                setSnackbar(
                  <Snackbar
                    onClose={() => setSnackbar(null)}
                    before={<Avatar size={24}><Icon28CheckCircleOutline fill="var(--vkui--color_icon_positive)" /></Avatar>}
                  >
                    Уведомления успешно разрешены
                  </Snackbar>
                );
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
      } else {
        throw new Error('messages_denied');
      }
    } catch (error: any) {
      console.error('AllowMessagesButton: error during permission request', error);
      let errorMessage = 'Не удалось разрешить уведомления';
      
      // Обрабатываем разные типы ошибок VK Bridge
      if (error?.error_type) {
        console.error('VK Bridge error:', error);
        
        if (error.error_type === 'client_error') {
          errorMessage = 'Ваше устройство не поддерживает уведомления';
        } else if (error.error_type === 'api_error') {
          if (error.error_data?.error_reason === 'Community messages are disabled') {
            errorMessage = 'Сообщения от сообщества отключены. Обратитесь к администратору.';
          } else if (error.error_data?.error_code === 901) {
            errorMessage = 'У приложения нет прав на отправку сообщений от сообщества';
          } else {
            errorMessage = `Ошибка VK API: ${error.error_data?.error_reason || 'Неизвестная ошибка'}`;
          }
        }
      } else if (error instanceof Error) {
        if (error.message === 'messages_denied') {
          errorMessage = 'Необходимо разрешить сообщения от сообщества';
        } else if (error.message.includes('Client doesnt support')) {
          errorMessage = 'Ваше устройство не поддерживает уведомления';
        } else if (error.message.includes('User denied')) {
          errorMessage = 'Вы отклонили запрос на разрешение уведомлений';
        }
      }
      
      setSnackbar(
        <Snackbar
          onClose={() => setSnackbar(null)}
          before={<Avatar size={24}><Icon28CancelCircleOutline fill="var(--vkui--color_icon_negative)" /></Avatar>}
        >
          {errorMessage}
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
      >
        Разрешить уведомления
      </Button>
      {snackbar}
    </>
  );
}

