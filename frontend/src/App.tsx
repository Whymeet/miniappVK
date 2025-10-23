import { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import {
  AdaptivityProvider,
  ConfigProvider,
  AppRoot,
  SplitLayout,
  SplitCol,
  View,
  Panel,
  PanelHeader,
} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import bridge from '@vkontakte/vk-bridge';
import { useConfig } from './hooks/useConfig';
import { useLaunchParams } from './hooks/useLaunchParams';
import { useSubscribe } from './hooks/useSubscription';
import OffersPage from './pages/OffersPage';
import PolicyPage from './pages/PolicyPage';
import { applyTheme } from './utils/theme';
import LoadingScreen from './components/LoadingScreen';
import ErrorScreen from './components/ErrorScreen';

function App() {
  const [scheme, setScheme] = useState<'light' | 'dark'>('light');
  const launchParams = useLaunchParams();
  const { data: config, isLoading, error } = useConfig(launchParams.groupId, launchParams.brand);
  const subscribeMutation = useSubscribe();

  useEffect(() => {
    // Инициализация VK Bridge
    bridge.send('VKWebAppInit');

    // Подписка на изменение темы
    bridge.subscribe((e) => {
      if (e.detail.type === 'VKWebAppUpdateConfig') {
        const vkScheme = e.detail.data.scheme;
        setScheme(vkScheme === 'space_gray' ? 'dark' : 'light');
      }
    });
  }, []);

  useEffect(() => {
    // Применяем тему при загрузке конфига
    if (config?.data) {
      applyTheme(config.data.palette);
    }
  }, [config]);

  // Автоматическая подписка при входе
  useEffect(() => {
    if (launchParams.userId && config?.data?.brand) {
      subscribeMutation.mutate({
        vkUserId: launchParams.userId,
        groupId: launchParams.groupId,
        brand: config.data.brand,
      });
    }
  }, [launchParams.userId, config?.data?.brand]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error || !config) {
    return <ErrorScreen error={error as Error} />;
  }

  return (
    <ConfigProvider appearance={scheme}>
      <AdaptivityProvider>
        <AppRoot>
          <Router>
            <SplitLayout>
              <SplitCol>
                <View activePanel="main">
                  <Panel id="main">
                    <PanelHeader>
                      {config.data.copy.title}
                    </PanelHeader>
                    <Routes>
                      <Route path="/" element={<OffersPage config={config.data} launchParams={launchParams} />} />
                      <Route path="/policy" element={<PolicyPage config={config.data} launchParams={launchParams} />} />
                    </Routes>
                  </Panel>
                </View>
              </SplitCol>
            </SplitLayout>
          </Router>
        </AppRoot>
      </AdaptivityProvider>
    </ConfigProvider>
  );
}

export default App;

