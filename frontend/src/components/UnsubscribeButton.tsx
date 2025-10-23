import { useState } from 'react';
import { Button, Snackbar, Avatar, Alert } from '@vkontakte/vkui';
import { Icon28CheckCircleOutline, Icon28CancelCircleOutline } from '@vkontakte/icons';
import { useUnsubscribe, useSubscriptionStatus } from '@/hooks/useSubscription';

interface UnsubscribeButtonProps {
  userId: string | null;
}

export default function UnsubscribeButton({ userId }: UnsubscribeButtonProps) {
  const [snackbar, setSnackbar] = useState<React.ReactNode>(null);
  const [showAlert, setShowAlert] = useState(false);
  const unsubscribeMutation = useUnsubscribe();
  const { data: subscriptionStatus } = useSubscriptionStatus(userId);

  // Проверяем, подписан ли пользователь
  const isSubscribed = subscriptionStatus?.success && subscriptionStatus.data?.subscribed;

  const handleUnsubscribeClick = () => {
    setShowAlert(true);
  };

  const handleConfirmUnsubscribe = async () => {
    setShowAlert(false);

    if (!userId) {
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

    unsubscribeMutation.mutate(userId, {
      onSuccess: (response) => {
        if (response.success) {
          setSnackbar(
            <Snackbar
              onClose={() => setSnackbar(null)}
              before={<Avatar size={24}><Icon28CheckCircleOutline fill="var(--color-success)" /></Avatar>}
            >
              Вы отписались от рассылки
            </Snackbar>
          );
        } else {
          setSnackbar(
            <Snackbar
              onClose={() => setSnackbar(null)}
              before={<Avatar size={24}><Icon28CancelCircleOutline fill="var(--color-error)" /></Avatar>}
            >
              Не удалось отписаться
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
            Произошла ошибка при отписке
          </Snackbar>
        );
      },
    });
  };

  // Если не подписан, не показываем кнопку
  if (!isSubscribed) {
    return null;
  }

  return (
    <>
      <Button
        size="l"
        stretched
        mode="tertiary"
        appearance="negative"
        onClick={handleUnsubscribeClick}
        loading={unsubscribeMutation.isPending}
      >
        Отписаться от рассылки
      </Button>

      {showAlert && (
        <Alert
          actions={[
            {
              title: 'Отменить',
              mode: 'cancel',
            },
            {
              title: 'Отписаться',
              mode: 'destructive',
              action: handleConfirmUnsubscribe,
            },
          ]}
          onClose={() => setShowAlert(false)}
          header="Отписка от рассылки"
          text="Вы уверены, что хотите отписаться? Вы не будете получать уведомления о новых предложениях."
        />
      )}

      {snackbar}
    </>
  );
}

