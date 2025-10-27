import { Card, Div, Title, Text, Button, Chip } from '@vkontakte/vkui';
import { Offer } from '@/types';
import { formatMoney, formatTerm } from '@/utils/format';
import Logo from './Logo';
import { useState, useEffect } from 'react';

interface OfferCardProps {
  offer: Offer;
  onApply: (offerId: string) => void;
  ctaText?: string;
}

export default function OfferCard({ offer, onApply, ctaText = 'Оформить' }: OfferCardProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 480);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
          onClick={() => onApply(offer.id)}
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
