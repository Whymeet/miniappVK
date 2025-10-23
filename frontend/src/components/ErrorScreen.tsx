import { Panel, PanelHeader, Placeholder, Button } from '@vkontakte/vkui';
import { Icon56ErrorOutline } from '@vkontakte/icons';

interface ErrorScreenProps {
  error?: Error | null;
}

export default function ErrorScreen({ error }: ErrorScreenProps) {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <Panel id="error">
      <PanelHeader>Ошибка</PanelHeader>
      <Placeholder
        icon={<Icon56ErrorOutline />}
        header="Что-то пошло не так"
        action={<Button size="m" onClick={handleReload}>Обновить</Button>}
      >
        {error?.message || 'Не удалось загрузить данные'}
      </Placeholder>
    </Panel>
  );
}

