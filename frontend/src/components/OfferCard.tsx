import { Card, Div, Title, Text, Button } from '@vkontakte/vkui';
import { Offer } from '@/types';
import { formatMoney, formatTerm } from '@/utils/format';
import Logo from './Logo';
import { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';

interface OfferCardProps {
  offer: Offer;
  onApply: (offerId: string) => void;
  ctaText?: string;
  userId?: string | null;
}

export default function OfferCard({ offer, onApply, ctaText = 'Оформить', userId }: OfferCardProps) {
  const [deviceWidth, setDeviceWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1024);

  useEffect(() => {
    const onResize = () => setDeviceWidth(window.innerWidth);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // breakpoints
  const isMobile = deviceWidth <= 420;
  const isSmallMobile = deviceWidth <= 360; // target 360x685 devices

  const handleApply = async () => {
    // Отправляем событие конверсии в VK Ads
    try {
      await bridge.send('VKWebAppTrackEvent', {
        event_name: 'lead',
        user_id: userId || undefined,
        event_params: {
          offer_id: offer.id,
          partner_name: offer.partner_name,
        }
      } as any);
      console.log('✅ VK Ads lead event sent for offer:', offer.id);
    } catch (error) {
      console.warn('⚠️ Failed to send VK Ads lead event:', error);
    }
    
    // Вызываем оригинальный обработчик
    onApply(offer.id);
  };

  // sizes tuned for small mobiles
  const padding = isSmallMobile ? '6px' : isMobile ? '10px' : 'var(--space-md)';

  // 🔽 новые размеры логотипа — существенно меньше, чем раньше
  const logoContainerHeight = isSmallMobile ? 68 : isMobile ? 80 : 92;

  const titleSize = isSmallMobile ? '14px' : isMobile ? '16px' : 'var(--text-md)';
  const paramLabelSize = isSmallMobile ? '13px' : isMobile ? '15px' : 'var(--text-sm)';
  const paramValueSize = isSmallMobile ? '16px' : isMobile ? '18px' : 'var(--text-md)';
  const btnFont = isSmallMobile ? '12px' : isMobile ? '11px' : '13px';
  const btnHeight = isSmallMobile ? '46px' : isMobile ? '44px' : '36px';

  return (
    <Card 
      mode="shadow" 
      className="offer-card-gradient" 
      style={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        padding: padding
      }}
    >
      <Div style={{ 
        padding: 0, 
        display: 'grid', 
        gap: isSmallMobile ? '6px' : isMobile ? 'var(--space-xs)' : 'var(--space-sm)', 
        height: '100%'
      }}>

        {/* Логотип — теперь меньше и по центру, в отдельном контейнере фиксированной высоты */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            maxHeight: logoContainerHeight,
            // лёгкий верхний отступ, чтобы не прилипал к краю карточки
            padding: isSmallMobile ? '4px 4px 0' : isMobile ? '6px 8px 0' : '8px 10px 0',
          }}
        >
          <Logo 
            src={offer.logo_url} 
            alt={offer.partner_name}
            style={{ 
              maxHeight: '100%',     // не выше контейнера
              maxWidth: '70%',       // логотип не шире 70% карточки
              width: 'auto',         // сохраняем пропорции
              objectFit: 'contain',
              borderRadius: '6px',
              display: 'block'
            }}
          />
        </div>
        
        {/* Название под логотипом */}
        <Title 
          level="3" 
          weight="2" 
          style={{ 
            fontSize: titleSize, 
            margin: 0,
            lineHeight: 1.3,
            textAlign: 'center'
          }}
        >
          {offer.partner_name}
        </Title>
        
        {/* Параметры в вертикальном стиле */}
        <div style={{ display: 'grid', gap: isSmallMobile ? 4 : isMobile ? 6 : 8 }}>
          {/* Сумма */}
          <div style={{ textAlign: 'center' }}>
            <Text style={{ 
              color: 'var(--text-muted)', 
              fontSize: paramLabelSize,
              display: 'block'
            }}>
              Сумма
            </Text>
            <Text 
              weight="2" 
              style={{ 
                fontSize: paramValueSize,
                color: 'var(--accent)',
                fontWeight: 'bold'
              }}
            >
              {formatMoney(offer.sum_max)}
            </Text>
          </div>
          
          {/* Особенность (первая из списка) */}
          {offer.features && offer.features.length > 0 && (
            <div style={{ textAlign: 'center' }}>
              <Text style={{ 
                fontSize: paramLabelSize,
                color: 'var(--accent)',
                fontWeight: 600
              }}>
                {offer.features[0]}
              </Text>
            </div>
          )}
          
          {/* Срок */}
          <div style={{ textAlign: 'center' }}>
            <Text style={{ 
              color: 'var(--text-muted)', 
              fontSize: paramLabelSize,
              display: 'block'
            }}>
              Срок
            </Text>
            <Text 
              weight="2" 
              style={{ 
                fontSize: paramValueSize,
                fontWeight: 'bold'
              }}
            >
              {formatTerm(offer.term_max)}
            </Text>
          </div>
        </div>

        {/* CTA */}
        <Button
          size="m"
          stretched
          mode="primary"
          onClick={handleApply}
          style={{ 
            marginTop: 'auto', 
            fontSize: btnFont,
            minHeight: btnHeight,
            fontWeight: 600,
            padding: isSmallMobile ? '10px 12px' : isMobile ? '10px 12px' : '8px 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            whiteSpace: 'normal',
            lineHeight: '1.3',
            textAlign: 'center',
            wordBreak: 'break-word'
          }}
        >
          {ctaText}
        </Button>
      </Div>
    </Card>
  );
}
