import { useState } from 'react';
import { Button, Snackbar, Avatar } from '@vkontakte/vkui';
import { Icon28CheckCircleOutline, Icon28CancelCircleOutline } from '@vkontakte/icons';
import bridge from '@vkontakte/vk-bridge';

interface AllowMessagesButtonProps {
  groupId: string | null;
}

export default function AllowMessagesButton({ groupId }: AllowMessagesButtonProps) {
  const [snackbar, setSnackbar] = useState<React.ReactNode>(null);

  const handleAllowMessages = async () => {
    if (!groupId) {
      setSnackbar(
        <Snackbar
          onClose={() => setSnackbar(null)}
          before={<Avatar size={24}><Icon28CancelCircleOutline fill="var(--color-error)" /></Avatar>}
        >
          Ошибка: Group ID не найден
        </Snackbar>
      );
      return;
    }

    try {
      const result = await bridge.send('VKWebAppAllowMessagesFromGroup', {
        group_id: parseInt(groupId),
      });

      if (result.result) {
        setSnackbar(
          <Snackbar
            onClose={() => setSnackbar(null)}
            before={<Avatar size={24}><Icon28CheckCircleOutline fill="var(--color-success)" /></Avatar>}
          >
            Уведомления разрешены
          </Snackbar>
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

  return (
    <>
      <Button
        size="l"
        stretched
        mode="secondary"
        onClick={handleAllowMessages}
      >
        Разрешить уведомления
      </Button>
      {snackbar}
    </>
  );
}

