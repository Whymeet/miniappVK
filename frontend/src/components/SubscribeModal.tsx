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
      // Если уже разрешены - не показываем модалку
      setActiveModal(null);
      onClose();
    }
  }, [subscriptionStatus, onClose]);

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
          await allowMessagesMutation.mutateAsync(
            { launchParams, groupId },
          );

          console.log('Saved successfully!');
        }
      } else {
        // Если нет groupId - просто сохраняем подписку без разрешения на уведомления
        console.log('No groupId, saving subscription without notifications...');
        
        await allowMessagesMutation.mutateAsync(
          { launchParams, groupId: '218513564' }, // Используем ID нашей группы
        );

        console.log('Subscription saved!');
      }
      
      // Закрываем модалку
      setActiveModal(null);
      onClose();
    } catch (error) {
      console.error('Failed to allow messages:', error);
      // Закрываем модалку даже если пользователь отказал
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
        <Div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          textAlign: 'center',
          padding: '24px'
        }}>
          <Icon56NotificationOutline style={{ color: 'var(--accent)' }} />
          
          <Spacing size={16} />
          
          <Title level="2" weight="2">
            ЭКСКЛЮЗИВНОЕ ПРЕДЛОЖЕНИЕ
          </Title>
          
          <Spacing size={12} />
          
          <Text style={{ 
            fontSize: '18px',
            fontWeight: 600,
            color: 'var(--accent)'
          }}>
            Получите займ под 0%
          </Text>
          
          <Spacing size={8} />
          
          <Text style={{ 
            fontSize: '15px',
            color: 'var(--text-secondary)',
            lineHeight: '1.5'
          }}>
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
            style={{ 
              marginBottom: '12px',
              background: 'var(--button-primary-background)',
              fontSize: '16px',
              fontWeight: 600
            }}
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
            Пропустить
          </Button>
        </Div>
      </ModalPage>
    </ModalRoot>
  );
}

