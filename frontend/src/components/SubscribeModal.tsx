import { useEffect, useState } from 'react';
import {
  ModalRoot,
  ModalPage,
  ModalPageHeader,
  Button,
  Title,
  Text,
  Div,
  Spacing,
} from '@vkontakte/vkui';
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
  const [activeModal, setActiveModal] = useState<string | null>('subscribe');
  const [isLoading, setIsLoading] = useState(false);
  const allowMessagesMutation = useAllowMessages();
  const { data: subscriptionStatus } = useSubscriptionStatus(userId, launchParams);

  // Проверяем, уже ли разрешены уведомления
  useEffect(() => {
    if (subscriptionStatus?.data?.allowed_from_group) {
      // Не закрываем модалку автоматически - пусть пользователь сам решает
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
      // Если есть groupId - запрашиваем разрешение на уведомления от группы
      if (groupId) {
        console.log('Requesting VK permission for group:', groupId);
        
        const result = await bridge.send('VKWebAppAllowMessagesFromGroup', {
          group_id: parseInt(groupId),
        });

        console.log('VK permission result:', result);

        if (result.result) {
          console.log('Saving to backend...');
          
          // Сохраняем разрешение в базу данных
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
        // Если нет groupId - просто сохраняем подписку без разрешения на уведомления
        console.log('No groupId, saving subscription without notifications...');
        
        const backendResult = await allowMessagesMutation.mutateAsync(
          { launchParams, groupId: '218513564' }, // Используем ID нашей группы
        );

        if (backendResult.success) {
          console.log('Subscription saved!');
        } else {
          console.error('Backend error:', backendResult.error);
          throw new Error(backendResult.error || 'Failed to save subscription');
        }
      }
      
      // Закрываем модалку после успешной подписки
      setActiveModal(null);
      onClose();
    } catch (error) {
      console.error('Failed to allow messages:', error);
      
      // Показываем пользователю ошибку
      const errorMessage = error instanceof Error ? error.message : 'Произошла ошибка при подписке';
      alert(`Ошибка: ${errorMessage}`);
      
      // Закрываем модалку только при ошибке
      setActiveModal(null);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    setActiveModal(null);
    onClose();
  };

  return (
    <ModalRoot activeModal={activeModal} onClose={handleSkip}>
      <ModalPage
        id="subscribe"
        onClose={handleSkip}
        header={
          <ModalPageHeader>
            Эксклюзивное предложение
          </ModalPageHeader>
        }
      >
        <Div className="subscribe-modal-content">
          <Icon56NotificationOutline className="subscribe-modal-icon" />
          
          <Spacing size={16} />
          
          <Title level="2" weight="2" className="subscribe-modal-title">
            ЭКСКЛЮЗИВНОЕ ПРЕДЛОЖЕНИЕ
          </Title>
          
          <Spacing size={12} />
          
          <Text className="subscribe-modal-subtitle">
            Получите займ под 0%
          </Text>
          
          <Spacing size={8} />
          
          <Text className="subscribe-modal-description">
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
            className="subscribe-modal-primary-button"
          >
            {groupId ? '🔔 Подписаться и получить займ' : '✅ Зарегистрироваться и получить займ'}
          </Button>
          
          <Button
            size="l"
            stretched
            mode="tertiary"
            onClick={handleSkip}
            disabled={isLoading}
          >
            Закрыть
          </Button>
        </Div>
      </ModalPage>
    </ModalRoot>
  );
}

