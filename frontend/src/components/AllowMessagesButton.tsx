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
      setSnackbar(
        <Snackbar
          onClose={() => setSnackbar(null)}
          before={<Avatar size={24}><Icon28CancelCircleOutline fill="var(--color-error)" /></Avatar>}
        >
          Ошибка: данные пользователя не найдены
        </Snackbar>
      );
      return;
    }

    try {
      // Запрашиваем разрешение у VK
      const result = await bridge.send('VKWebAppAllowMessagesFromGroup', {
        group_id: parseInt(groupId),
      });

      if (result.result) {
        // Сохраняем разрешение в базу данных
        allowMessagesMutation.mutate(
          { launchParams, groupId },
          {
            onSuccess: (response) => {
              if (response.success) {
                console.log('AllowMessagesButton: subscription successful, updating state');
                setIsAllowed(true);
                // Сохраняем в localStorage для быстрого доступа
                localStorage.setItem(`messages_allowed_${userId}`, 'true');
                
                setSnackbar(
                  <Snackbar
                    onClose={() => setSnackbar(null)}
                    before={<Avatar size={24}><Icon28CheckCircleOutline fill="var(--color-success)" /></Avatar>}
                  >
                    Уведомления разрешены
                  </Snackbar>
                );
              }
            },
            onError: () => {
              setSnackbar(
                <Snackbar
                  onClose={() => setSnackbar(null)}
                  before={<Avatar size={24}><Icon28CancelCircleOutline fill="var(--color-error)" /></Avatar>}
                >
                  Не удалось сохранить разрешение
                </Snackbar>
              );
            },
          }
        );
      }
    } catch (error) {
      setSnackbar(
        <Snackbar
          onClose={() => setSnackbar(null)}
          before={<Avatar size={24}><Icon28CancelCircleOutline fill="var(--color-error)" /></Avatar>}
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
                before={<Avatar size={24}><Icon28CheckCircleOutline fill="var(--color-success)" /></Avatar>}
              >
                Функция отписки будет добавлена позже
              </Snackbar>
            );
          }}
        >
          Отписаться от уведомлений
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

