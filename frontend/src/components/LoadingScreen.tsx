import { Panel, PanelHeader, Spinner, Group } from '@vkontakte/vkui';

export default function LoadingScreen() {
  return (
    <Panel id="loading">
      <PanelHeader>Загрузка</PanelHeader>
      <Group>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '60vh' 
        }}>
          <Spinner size="large" />
        </div>
      </Group>
    </Panel>
  );
}

