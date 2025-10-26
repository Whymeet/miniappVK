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
import SubscribeModal from './components/SubscribeModal';

function App() {
  const [scheme, setScheme] = useState<'light' | 'dark'>('light');
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
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
      applyTheme(config.data.palette, config.data.sort_buttons, config.data.card_gradient);
    }
  }, [config]);

  // Автоматическая подписка при входе
  useEffect(() => {
    if (launchParams.userId && config?.data?.brand && (launchParams as any).rawParams) {
      console.log('Auto-subscribing with params:', {
        hasRawParams: !!(launchParams as any).rawParams,
        rawParamsKeys: Object.keys((launchParams as any).rawParams || {}),
        brand: config.data.brand
      });
      
      subscribeMutation.mutate({
        launchParams: (launchParams as any).rawParams,
        brand: config.data.brand,
      });
    } else {
      console.warn('Cannot auto-subscribe:', {
        hasUserId: !!launchParams.userId,
        hasBrand: !!config?.data?.brand,
        hasRawParams: !!(launchParams as any).rawParams
      });
    }
  }, [launchParams.userId, config?.data?.brand]);

  // Показываем модалку подписки после загрузки конфига
  useEffect(() => {
    if (config?.data && launchParams.userId) {
      console.log('Checking if should show modal:', {
        userId: launchParams.userId,
        groupId: launchParams.groupId,
        hasRawParams: !!(launchParams as any).rawParams,
        rawParams: (launchParams as any).rawParams
      });
      
      console.log('Full rawParams object:', (launchParams as any).rawParams);
      
      // Проверяем localStorage - показывали ли уже модалку
      const modalShown = localStorage.getItem(`subscribe_modal_shown_${launchParams.userId}`);
      
      if (!modalShown && config.data.features.enable_messages) {
        // Небольшая задержка для лучшего UX
        setTimeout(() => {
          setShowSubscribeModal(true);
        }, 500);
      }
    }
  }, [config, launchParams.userId]);

  const handleCloseSubscribeModal = () => {
    setShowSubscribeModal(false);
    // Сохраняем, что модалка была показана
    if (launchParams.userId) {
      localStorage.setItem(`subscribe_modal_shown_${launchParams.userId}`, 'true');
    }
  };

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
                    <Routes>
                      <Route path="/" element={<OffersPage config={config.data} launchParams={launchParams} />} />
                      <Route path="/policy" element={<PolicyPage config={config.data} launchParams={launchParams} />} />
                    </Routes>
                  </Panel>
                </View>
              </SplitCol>
            </SplitLayout>
          </Router>

          {/* Модалка подписки */}
          {showSubscribeModal && (
            <SubscribeModal
              groupId={launchParams.groupId}
              userId={launchParams.userId}
              launchParams={(launchParams as any).rawParams}
              onClose={handleCloseSubscribeModal}
            />
          )}
        </AppRoot>
      </AdaptivityProvider>
    </ConfigProvider>
  );
}

export default App;

