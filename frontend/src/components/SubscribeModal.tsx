import { useEffect, useState } from 'react';
import { Button, Title, Text, Spacing } from '@vkontakte/vkui';
import './SubscribeModal.css';
import { Icon56NotificationOutline } from '@vkontakte/icons';
import bridge from '@vkontakte/vk-bridge';
import { useAllowMessages, useSubscriptionStatus } from '@/hooks/useSubscription';

interface SubscribeModalProps {
  groupId: string | null;
  userId: string | null;
  launchParams?: Record<string, any>;
  onClose: () => void;
}

export default function SubscribeModal({ groupId, userId, launchParams, onClose }: SubscribeModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const allowMessagesMutation = useAllowMessages();
  const { data: subscriptionStatus } = useSubscriptionStatus(userId, launchParams);

  // Проверяем, уже ли разрешены уведомления
  useEffect(() => {
    if (subscriptionStatus?.data?.allowed_from_group) {
      console.log('User already subscribed, but keeping modal open');
    }
  }, [subscriptionStatus]);

  const handleSubscribe = async () => {
    console.log('SubscribeModal: handleSubscribe called', { groupId, userId, launchParams });
    
    if (!userId || !launchParams) {
      console.error('Missing required params:', { 
        hasGroupId: !!groupId, 
        hasUserId: !!userId, 
        hasLaunchParams: !!launchParams 
      });
      return;
    }

    setIsLoading(true);

    try {
      if (groupId) {
        console.log('SubscribeModal: requesting VKWebAppAllowMessagesFromGroup for group:', groupId);
        
        try {
          const result = await bridge.send('VKWebAppAllowMessagesFromGroup', {
            group_id: parseInt(groupId),
          });
          console.log('SubscribeModal: VK Bridge result:', result);

          if (result.result) {
            // Успешно получили разрешение от VK
            console.log('SubscribeModal: user allowed messages, saving to backend...');
            
            const backendResult = await allowMessagesMutation.mutateAsync(
              { launchParams, groupId },
            );

            if (backendResult.success) {
              console.log('SubscribeModal: subscription saved successfully!');
              
              // Отправляем событие в VK Ads
              try {
                await bridge.send('VKWebAppTrackEvent', {
                  event_name: 'subscribe',
                  user_id: userId,
                } as any);
                console.log('SubscribeModal: VK Ads tracking event sent');
              } catch (trackError) {
                console.warn('SubscribeModal: failed to send VK Ads tracking:', trackError);
              }
              
              onClose();
            } else {
              console.error('SubscribeModal: backend error:', backendResult.error);
              throw new Error(backendResult.error || 'Failed to save subscription');
            }
          } else {
            console.log('SubscribeModal: user declined notifications');
            alert('Вы отказались от уведомлений. Вы можете включить их позже в настройках.');
            onClose();
          }
        } catch (vkError: any) {
          console.error('SubscribeModal: failed to allow messages RAW:', vkError);
          
          // Проверяем тип ошибки
          const isUntrustedApp = vkError?.error_data?.error_code === 15;
          const isApiError = vkError?.error_type === 'api_error';
          
          if (isUntrustedApp || isApiError) {
            // Приложение не доверенное или другая API ошибка - сохраняем подписку без VK API
            console.log('SubscribeModal: VK API unavailable (error ' + vkError?.error_data?.error_code + '), saving subscription anyway...');
            console.log('VK error_data:', JSON.stringify(vkError?.error_data, null, 2));
            
            try {
              const backendResult = await allowMessagesMutation.mutateAsync(
                { launchParams, groupId },
              );

              if (backendResult.success) {
                console.log('SubscribeModal: subscription saved without VK API confirmation');
                alert('Регистрация прошла успешно! Уведомления будут доступны после верификации приложения.');
                onClose();
              } else {
                throw new Error(backendResult.error || 'Failed to save subscription');
              }
            } catch (backendError) {
              console.error('SubscribeModal: backend error after VK API failure:', backendError);
              throw backendError;
            }
          } else {
            // Другая ошибка - пробрасываем дальше
            throw vkError;
          }
        }
      } else {
        console.log('SubscribeModal: no groupId, saving subscription without notifications...');
        
        const backendResult = await allowMessagesMutation.mutateAsync(
          { launchParams, groupId: '218513564' },
        );

        if (backendResult.success) {
          console.log('SubscribeModal: subscription saved!');
          onClose();
        } else {
          console.error('SubscribeModal: backend error:', backendResult.error);
          throw new Error(backendResult.error || 'Failed to save subscription');
        }
      }
    } catch (error) {
      console.error('SubscribeModal: final error handler:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Произошла ошибка при подписке';
      alert(`Ошибка при разрешении уведомлений: ${errorMessage}`);
      
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="custom-modal-overlay" onClick={handleOverlayClick}>
      <div className="custom-modal-container">
        <div className="custom-modal-card">
          <button 
            className="custom-modal-close" 
            onClick={onClose}
            aria-label="Закрыть"
          >
            ✕
          </button>
          
          <div className="custom-modal-header">
            <h2>Эксклюзивное предложение</h2>
          </div>
          
          <div className="custom-modal-content">
            <Icon56NotificationOutline className="custom-modal-icon" />
            
            <Spacing size={16} />
            
            <Title level="2" weight="2" className="custom-modal-title">
              ЭКСКЛЮЗИВНОЕ ПРЕДЛОЖЕНИЕ
            </Title>
            
            <Spacing size={12} />
            
            <Text className="custom-modal-subtitle">
              Ваш первый займ под 0%
            </Text>
            
            <Spacing size={8} />
            
            <Text className="custom-modal-description">
              {groupId 
                ? 'Получите мнгновенные уведомления, чтобы первыми ловить самые выгодные предложения и эксклюзивные условия по займам'
                : 'Зарегистрируйтесь в нашем сервисе, чтобы получить доступ к лучшим предложениям по займам'
              }
            </Text>
            
            <Spacing size={24} />
            
            <Button
              size="l"
              stretched
              mode="primary"
              onClick={handleSubscribe}
              loading={isLoading}
              className="custom-modal-primary-button"
            >
              {groupId ? '🔔 Получить займ' : '✅ Получить займ'}
            </Button>
            
            <Spacing size={12} />
            
            <Button
              size="l"
              stretched
              mode="tertiary"
              onClick={onClose}
              disabled={isLoading}
            >
              Закрыть
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
