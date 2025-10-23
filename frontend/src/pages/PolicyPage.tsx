import { useNavigate } from 'react-router-dom';
import { Group, Header, Div, Title, Text, Button } from '@vkontakte/vkui';
import { Icon24ChevronLeft } from '@vkontakte/icons';
import { BrandConfig, LaunchParams } from '@/types';
import UnsubscribeButton from '@/components/UnsubscribeButton';

interface PolicyPageProps {
  config: BrandConfig;
  launchParams: LaunchParams;
}

export default function PolicyPage({ config, launchParams }: PolicyPageProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  return (
    <>
      <Group>
        <Div>
          <Button
            mode="tertiary"
            before={<Icon24ChevronLeft />}
            onClick={handleBack}
          >
            Назад
          </Button>
        </Div>
      </Group>

      <Group header={<Header mode="secondary">{config.copy.policy_title}</Header>}>
        <Div>
          <Title level="2" weight="2" style={{ marginBottom: 16 }}>
            {config.copy.policy_title}
          </Title>
          
          <Text style={{ whiteSpace: 'pre-line', lineHeight: 1.6 }}>
            {config.copy.policy_text}
          </Text>
          
          <Div style={{ marginTop: 24, padding: 16, background: 'var(--color-surface)', borderRadius: 8 }}>
            <Text weight="2" style={{ marginBottom: 8 }}>
              Обработка персональных данных
            </Text>
            <Text style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>
              Используя данный сервис, вы соглашаетесь с условиями обработки персональных данных 
              в соответствии с законодательством РФ.
            </Text>
          </Div>

          <Div style={{ marginTop: 24, padding: 16, background: 'var(--color-surface)', borderRadius: 8 }}>
            <Text weight="2" style={{ marginBottom: 8 }}>
              Отказ от ответственности
            </Text>
            <Text style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>
              {config.copy.disclaimer}
            </Text>
          </Div>

          <Div style={{ marginTop: 24 }}>
            <Text style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
              По вопросам обработки персональных данных обращайтесь по адресу: support@example.com
            </Text>
          </Div>
        </Div>
      </Group>

      <Group header={<Header mode="secondary">Управление подпиской</Header>}>
        <Div>
          <Text style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginBottom: 16 }}>
            Если вы не хотите получать уведомления о новых предложениях, вы можете отписаться от рассылки.
          </Text>
          {launchParams.userId && <UnsubscribeButton userId={launchParams.userId} />}
        </Div>
      </Group>

      <Group>
        <Div>
          <Button
            size="l"
            stretched
            mode="primary"
            onClick={handleBack}
          >
            Понятно
          </Button>
        </Div>
      </Group>
    </>
  );
}

