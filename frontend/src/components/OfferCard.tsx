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
        padding: isMobile ? 'var(--space-sm)' : 'var(--space-md)'
      }}
    >
      <Div style={{ 
        padding: 0, 
        display: 'grid', 
        gap: isMobile ? 'var(--space-xs)' : 'var(--space-sm)', 
        height: '100%',
        position: 'relative'
      }}>
        {/* Статус-тег вверху */}
        {offer.features.length > 0 && (
          <div style={{
            position: 'absolute',
            top: '-6px',
            left: '8px',
            backgroundColor: 'var(--accent)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '10px',
            fontWeight: 600,
            zIndex: 1
          }}>
            🌟 {offer.features[0]}
          </div>
        )}

        {/* Логотип на всю ширину */}
        <Logo 
          src={offer.logo_url} 
          alt={offer.partner_name}
          style={{ 
            width: '100%',
            minHeight: isMobile ? 100 : 80,
            maxHeight: isMobile ? 180 : 120,
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

        {/* Рейтинг со звёздами */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          gap: '4px'
        }}>
          <Text style={{ 
            fontSize: isMobile ? 'var(--text-sm)' : 'var(--text-md)', 
            fontWeight: 600,
            color: 'var(--text-primary)'
          }}>
            4.8
          </Text>
          <div style={{ display: 'flex', color: '#FFD700' }}>
            {'★★★★★'.split('').map((star, i) => (
              <span key={i} style={{ fontSize: isMobile ? '12px' : '14px' }}>{star}</span>
            ))}
          </div>
        </div>

        {/* Параметры в вертикальном стиле */}
        <div style={{ display: 'grid', gap: isMobile ? 4 : 6 }}>
          {/* Сумма */}
          <div style={{ textAlign: 'center' }}>
            <Text style={{ 
              color: 'var(--text-muted)', 
              fontSize: isMobile ? 'var(--text-xs)' : 'var(--text-sm)',
              display: 'block'
            }}>
              Сумма
            </Text>
            <Text 
              weight="2" 
              style={{ 
                fontSize: isMobile ? 'var(--text-sm)' : 'var(--text-md)',
                color: 'var(--accent)',
                fontWeight: 'bold'
              }}
            >
              {formatMoney(offer.sum_max)}
            </Text>
          </div>
          
          {/* Первый займ бесплатно */}
          <div style={{ textAlign: 'center' }}>
            <Text style={{ 
              fontSize: isMobile ? 'var(--text-xs)' : 'var(--text-sm)',
              color: 'var(--text-primary)'
            }}>
              Первый займ <Text weight="2" style={{ color: 'var(--accent)' }}>бесплатно</Text>
            </Text>
          </div>
          
          {/* Срок */}
          <div style={{ textAlign: 'center' }}>
            <Text style={{ 
              color: 'var(--text-muted)', 
              fontSize: isMobile ? 'var(--text-xs)' : 'var(--text-sm)',
              display: 'block'
            }}>
              Срок
            </Text>
            <Text 
              weight="2" 
              style={{ 
                fontSize: isMobile ? 'var(--text-sm)' : 'var(--text-md)',
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
            fontSize: '12px',
            minHeight: isMobile ? '48px' : '36px',
            fontWeight: 600
          }}
        >
          {ctaText}
        </Button>
      </Div>
    </Card>
  );
}
