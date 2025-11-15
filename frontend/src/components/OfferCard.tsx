import { Card, Div, Title, Text, Button, Chip } from '@vkontakte/vkui';
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
      const result = await bridge.send('VKWebAppTrackEvent', {
        event_name: 'lead',
        user_id: userId || undefined,
        event_params: {
          offer_id: offer.id,
          partner_name: offer.partner_name,
        }
      } as any);
      
      console.log('📊 VK Ads Event Details:', {
        event: 'lead',
        offer_id: offer.id,
        partner_name: offer.partner_name,
        user_id: userId,
        result: result,
        timestamp: new Date().toISOString()
      });
      
      if (result.result) {
        console.log('✅ VK Ads confirmed: Event delivered successfully');
      } else {
        console.warn('⚠️ VK Ads response: Event may not be delivered', result);
      }
    } catch (error) {
      console.error('❌ VK Ads ERROR:', error);
      console.error('Event data:', {
        event_name: 'lead',
        user_id: userId,
        offer_id: offer.id
      });
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
        gap: isMobile ? 'var(--space-sm)' : 'var(--space-sm)', 
        height: '100%' 
      }}>
        {/* Шапка */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: isMobile ? 'var(--space-sm)' : 'var(--space-sm)' 
        }}>
          <Logo 
            src={offer.logo_url} 
            alt={offer.partner_name}
            style={{ 
              width: isMobile ? 48 : 56, 
              height: isMobile ? 48 : 56, 
              objectFit: 'contain',
              borderRadius: '8px'
            }}
          />
          <Title 
            level="3" 
            weight="2" 
            style={{ 
              fontSize: isMobile ? 'var(--text-sm)' : 'var(--text-md)', 
              margin: 0,
              lineHeight: 1.3
            }}
          >
            {offer.partner_name}
          </Title>
        </div>

        {/* Ставка — всегда черная */}
        <Text 
          weight="3" 
          style={{ 
            fontSize: isMobile ? 'var(--text-lg)' : 'var(--text-xl)', 
            color: 'var(--text)',
            lineHeight: 1.2
          }}
        >
          {offer.rate_text}
        </Text>

        {/* Параметры */}
        <div style={{ display: 'grid', gap: isMobile ? 8 : 6 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Text style={{ 
              color: 'var(--text-muted)', 
              fontSize: isMobile ? 'var(--text-xs)' : 'var(--text-sm)' 
            }}>
              Сумма
            </Text>
            <Text 
              weight="2" 
              style={{ 
                fontSize: isMobile ? 'var(--text-xs)' : 'var(--text-sm)',
                textAlign: 'right'
              }}
            >
              {formatMoney(offer.sum_min)}–{formatMoney(offer.sum_max)}
            </Text>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Text style={{ 
              color: 'var(--text-muted)', 
              fontSize: isMobile ? 'var(--text-xs)' : 'var(--text-sm)' 
            }}>
              Срок
            </Text>
            <Text 
              weight="2" 
              style={{ 
                fontSize: isMobile ? 'var(--text-xs)' : 'var(--text-sm)',
                textAlign: 'right'
              }}
            >
              {formatTerm(offer.term_min)}–{formatTerm(offer.term_max)}
            </Text>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Text style={{ 
              color: 'var(--text-muted)', 
              fontSize: isMobile ? 'var(--text-xs)' : 'var(--text-sm)' 
            }}>
              Одобрение
            </Text>
            <Text 
              weight="2" 
              style={{ 
                fontSize: isMobile ? 'var(--text-xs)' : 'var(--text-sm)',
                textAlign: 'right'
              }}
            >
              {offer.approval_time}
            </Text>
          </div>
        </div>

        {/* Чипы */}
        {!!offer.features.length && (
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: isMobile ? 'var(--space-xs)' : 'var(--space-xs)' 
          }}>
            {offer.features.slice(0, 2).map((feature, i) => (
              <Chip 
                key={i}
                style={{ 
                  fontSize: isMobile ? 'var(--text-xs)' : 'var(--text-xs)',
                  padding: isMobile ? '6px 10px' : '4px 8px'
                }}
              >
                {feature}
              </Chip>
            ))}
          </div>
        )}

        {/* CTA */}
        <Button
          size="m"
          stretched
          mode="primary"
          onClick={handleApply}
          style={{ 
            marginTop: 'auto', 
            fontSize: isMobile ? 'var(--text-sm)' : 'var(--text-base)',
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
