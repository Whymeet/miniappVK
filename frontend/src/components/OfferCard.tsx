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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 480);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  return (
    <Card 
      mode="shadow" 
      className="offer-card-gradient" 
      style={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        padding: isMobile ? '6px' : 'var(--space-md)'
      }}
    >
      <Div style={{ 
        padding: 0, 
        display: 'grid', 
        gap: isMobile ? 'var(--space-xs)' : 'var(--space-sm)', 
        height: '100%'
      }}>

        {/* Логотип на всю ширину */}
        <Logo 
          src={offer.logo_url} 
          alt={offer.partner_name}
          style={{ 
            width: '100%',
            minHeight: isMobile ? 120 : 100,
            maxHeight: isMobile ? 200 : 140,
            objectFit: 'contain',
            borderRadius: '8px'
          }}
        />
        
        {/* Название под логотипом */}
        <Title 
          level="3" 
          weight="2" 
          style={{ 
            fontSize: isMobile ? 'var(--text-sm)' : 'var(--text-md)', 
            margin: 0,
            lineHeight: 1.3,
            textAlign: 'center'
          }}
        >
          {offer.partner_name}
        </Title>
        
        {/* Параметры в вертикальном стиле */}
        <div style={{ display: 'grid', gap: isMobile ? 3 : 6 }}>
          {/* Сумма */}
          <div style={{ textAlign: 'center' }}>
            <Text style={{ 
              color: 'var(--text-muted)', 
              fontSize: isMobile ? '16px' : 'var(--text-sm)',
              display: 'block'
            }}>
              Сумма
            </Text>
            <Text 
              weight="2" 
              style={{ 
                fontSize: isMobile ? '18px' : 'var(--text-md)',
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
                fontSize: isMobile ? '16px' : 'var(--text-sm)',
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
              fontSize: isMobile ? '16px' : 'var(--text-sm)',
              display: 'block'
            }}>
              Срок
            </Text>
            <Text 
              weight="2" 
              style={{ 
                fontSize: isMobile ? '18px' : 'var(--text-md)',
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
            fontSize: isMobile ? '11px' : '13px',
            minHeight: isMobile ? '44px' : '36px',
            fontWeight: 600,
            padding: isMobile ? '10px 12px' : '8px 12px',
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
