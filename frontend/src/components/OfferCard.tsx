import { Card, Div, Title, Text, Button, Avatar, Chip } from '@vkontakte/vkui';
import { Offer } from '@/types';
import { formatMoney, formatTerm } from '@/utils/format';

interface OfferCardProps {
  offer: Offer;
  onApply: (offerId: string) => void;
  ctaText?: string;
}

export default function OfferCard({ offer, onApply, ctaText = 'Оформить' }: OfferCardProps) {
  return (
    <Card mode="shadow" style={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      minHeight: '280px'
    }}>
      <Div style={{ 
        padding: 'var(--space-md)', 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%',
        gap: 'var(--space-sm)'
      }}>
        {/* Лого и название */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
          <Avatar src={offer.logo_url} size={40} />
          <Title level="3" weight="2" style={{ 
            fontSize: 'var(--text-md)', 
            margin: 0,
            color: 'var(--text)'
          }}>
            {offer.partner_name}
          </Title>
        </div>

        {/* Ключевая метрика - КРУПНО */}
        <div style={{ 
          textAlign: 'center', 
          padding: 'var(--space-sm)',
          backgroundColor: '#F0FDF4',
          borderRadius: 'var(--radius-sm)',
          margin: 'var(--space-xs) 0'
        }}>
          <Text weight="3" style={{ 
            color: 'var(--accent)', 
            fontSize: 'var(--text-xl)',
            fontWeight: '700'
          }}>
            {offer.rate_text}
          </Text>
        </div>

        {/* Параметры */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 'var(--space-xs)',
          fontSize: 'var(--text-sm)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Text style={{ color: 'var(--muted)', fontSize: 'var(--text-sm)' }}>Сумма</Text>
            <Text weight="2" style={{ fontSize: 'var(--text-sm)' }}>
              {formatMoney(offer.sum_min)}–{formatMoney(offer.sum_max)}
            </Text>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Text style={{ color: 'var(--muted)', fontSize: 'var(--text-sm)' }}>Срок</Text>
            <Text weight="2" style={{ fontSize: 'var(--text-sm)' }}>
              {formatTerm(offer.term_min)}–{formatTerm(offer.term_max)}
            </Text>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Text style={{ color: 'var(--muted)', fontSize: 'var(--text-sm)' }}>Одобрение</Text>
            <Text weight="2" style={{ fontSize: 'var(--text-sm)' }}>{offer.approval_time}</Text>
          </div>
        </div>

        {/* Чипы - маленькие и спокойные */}
        {offer.features.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-xs)' }}>
            {offer.features.slice(0, 2).map((feature, index) => (
              <Chip 
                key={index} 
                style={{ 
                  fontSize: 'var(--text-xs)', 
                  padding: '4px 8px',
                  backgroundColor: '#F3F4F6',
                  color: 'var(--muted)'
                }}
              >
                {feature}
              </Chip>
            ))}
          </div>
        )}

        {/* CTA */}
        <Button
          size="l"
          stretched
          mode="primary"
          onClick={() => onApply(offer.id)}
          style={{ marginTop: 'auto' }}
        >
          {ctaText}
        </Button>
      </Div>
    </Card>
  );
}

