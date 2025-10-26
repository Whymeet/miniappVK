import { useEffect, useState } from 'react';
import {
  ModalRoot,
  ModalPage,
  ModalPageHeader,
  Button,
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
            <div style={{ 
              textAlign: 'center', 
              fontSize: '18px', 
              fontWeight: '600',
              color: 'var(--text-primary)'
            }}>
              🎉 Эксклюзивное предложение
            </div>
          </ModalPageHeader>
        }
      >
        <div style={{ 
          padding: '32px 24px',
          minHeight: '400px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
          borderRadius: '12px',
          margin: '16px'
        }}>
          {/* Иконка */}
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '24px',
            boxShadow: '0 8px 24px rgba(0, 123, 255, 0.3)'
          }}>
            <Icon56NotificationOutline style={{ 
              color: 'white',
              fontSize: '40px'
            }} />
          </div>
          
          {/* Заголовок */}
          <h2 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: 'var(--text-primary)',
            margin: '0 0 12px 0',
            lineHeight: '1.2'
          }}>
            ЭКСКЛЮЗИВНОЕ ПРЕДЛОЖЕНИЕ
          </h2>
          
          {/* Подзаголовок */}
          <div style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#007bff',
            marginBottom: '16px',
            background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Получите займ под 0%
          </div>
          
          {/* Описание */}
          <p style={{
            fontSize: '16px',
            color: 'var(--text-secondary)',
            lineHeight: '1.5',
            margin: '0 0 32px 0',
            maxWidth: '320px'
          }}>
            {groupId 
              ? 'Подпишитесь на уведомления, чтобы первыми узнавать о новых предложениях и эксклюзивных условиях'
              : 'Зарегистрируйтесь в нашем сервисе, чтобы получить доступ к лучшим предложениям по займам'
            }
          </p>
          
          {/* Кнопки */}
          <div style={{ width: '100%', maxWidth: '280px' }}>
            <Button
              size="l"
              stretched
              mode="primary"
              onClick={handleSubscribe}
              loading={isLoading}
              style={{ 
                marginBottom: '16px',
                background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)',
                border: 'none',
                fontSize: '16px',
                fontWeight: '600',
                height: '48px',
                borderRadius: '12px',
                boxShadow: '0 4px 16px rgba(0, 123, 255, 0.3)'
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
              style={{
                fontSize: '14px',
                color: 'var(--text-secondary)',
                height: '40px',
                borderRadius: '8px'
              }}
            >
              Пропустить
            </Button>
          </div>
        </div>
      </ModalPage>
    </ModalRoot>
  );
}

