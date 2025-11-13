import { useEffect, useState } from 'react';
import { Button, Title, Text, Spacing } from '@vkontakte/vkui';
import './SubscribeModal.css';
import { Icon56NotificationOutline } from '@vkontakte/icons';
import bridge from '@vkontakte/vk-bridge';
import { useAllowMessages, useSubscriptionStatus } from '@/hooks/useSubscription';
import { trackSubscribe } from '@/utils/analytics';

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
    console.log('handleSubscribe called', { groupId, userId, launchParams });
    
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
        console.log('Requesting VK permission for group:', groupId);
        
        const result = await bridge.send('VKWebAppAllowMessagesFromGroup', {
          group_id: parseInt(groupId),
        });

        console.log('VK permission result:', result);

        if (result.result) {
          console.log('Saving to backend...');
          
          // Отслеживаем подписку в VK Ads
          await trackSubscribe(userId);
          
          const backendResult = await allowMessagesMutation.mutateAsync(
            { launchParams, groupId },
          );

          if (backendResult.success) {
            console.log('Saved successfully!');
          } else {
            console.error('Backend error:', backendResult.error);
            throw new Error(backendResult.error || 'Failed to save subscription');
          }
        }
      } else {
        console.log('No groupId, saving subscription without notifications...');
        
        const backendResult = await allowMessagesMutation.mutateAsync(
          { launchParams, groupId: '218513564' },
        );

        if (backendResult.success) {
          console.log('Subscription saved!');
        } else {
          console.error('Backend error:', backendResult.error);
          throw new Error(backendResult.error || 'Failed to save subscription');
        }
      }
      
      onClose();
    } catch (error) {
      console.error('Failed to allow messages:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Произошла ошибка при подписке';
      alert(`Ошибка: ${errorMessage}`);
      
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
              Получите займ под 0%
            </Text>
            
            <Spacing size={8} />
            
            <Text className="custom-modal-description">
              {groupId 
                ? 'Подпишитесь на уведомления, чтобы первыми узнавать о новых предложениях и эксклюзивных условиях'
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
              {groupId ? '🔔 Подписаться и получить займ' : '✅ Зарегистрироваться и получить займ'}
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
