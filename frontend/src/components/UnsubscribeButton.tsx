import { useState } from 'react';
import { Button, Snackbar, Avatar, ModalRoot, ModalCard } from '@vkontakte/vkui';
import { Icon28CheckCircleOutline, Icon28CancelCircleOutline } from '@vkontakte/icons';
import { useUnsubscribe, useSubscriptionStatus } from '@/hooks/useSubscription';

interface UnsubscribeButtonProps {
  userId: string | null;
  launchParams?: Record<string, any>;
}

export default function UnsubscribeButton({ userId, launchParams }: UnsubscribeButtonProps) {
  const [snackbar, setSnackbar] = useState<React.ReactNode>(null);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const unsubscribeMutation = useUnsubscribe();
  const { data: subscriptionStatus } = useSubscriptionStatus(userId, launchParams);

  // Проверяем, подписан ли пользователь
  const isSubscribed = subscriptionStatus?.success && subscriptionStatus.data?.subscribed;

  const handleUnsubscribeClick = () => {
    setActiveModal('unsubscribe-confirm');
  };

  const handleConfirmUnsubscribe = async () => {
    setActiveModal(null);

    if (!userId || !launchParams) {
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

    unsubscribeMutation.mutate({ launchParams, vkUserId: userId }, {
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

  const modal = (
    <ModalRoot activeModal={activeModal} onClose={() => setActiveModal(null)}>
      <ModalCard
        id="unsubscribe-confirm"
        onClose={() => setActiveModal(null)}
        header="Отписка от рассылки"
        actions={[
          {
            title: 'Отменить',
            mode: 'secondary',
            action: () => setActiveModal(null),
          },
          {
            title: 'Отписаться',
            mode: 'destructive',
            action: handleConfirmUnsubscribe,
          },
        ]}
      >
        Вы уверены, что хотите отписаться? Вы не будете получать уведомления о новых предложениях.
      </ModalCard>
    </ModalRoot>
  );

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

      {modal}
      {snackbar}
    </>
  );
}

