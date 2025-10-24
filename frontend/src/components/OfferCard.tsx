import { Card, Div, Title, Text, Button, Avatar, Chip } from '@vkontakte/vkui';
import { Offer } from '@/types';
import { formatMoney, formatTerm } from '@/utils/format';

interface OfferCardProps {
  offer: Offer;
  onApply: (offerId: string) => void;
  ctaText?: string;
}

export default function OfferCard({ offer, onApply, ctaText = 'Перейти' }: OfferCardProps) {
  return (
    <Card mode="shadow" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Div style={{ padding: '12px', display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 8 }}>
          <Avatar src={offer.logo_url} size={48} style={{ margin: '0 auto' }} />
          <Title level="3" weight="2" style={{ fontSize: '14px', marginTop: 6 }}>
            {offer.partner_name}
          </Title>
          <Text weight="3" style={{ color: 'var(--color-primary)', fontSize: '13px' }}>
            {offer.rate_text}
          </Text>
        </div>

        <div style={{ marginBottom: 8, fontSize: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <Text weight="2" style={{ fontSize: '12px' }}>Сумма:</Text>
            <Text style={{ fontSize: '12px' }}>{formatMoney(offer.sum_min)}-{formatMoney(offer.sum_max)}</Text>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <Text weight="2" style={{ fontSize: '12px' }}>Срок:</Text>
            <Text style={{ fontSize: '12px' }}>{formatTerm(offer.term_min)}-{formatTerm(offer.term_max)}</Text>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <Text weight="2" style={{ fontSize: '12px' }}>Одобрение:</Text>
            <Text style={{ fontSize: '12px' }}>{offer.approval_time}</Text>
          </div>
        </div>

        {offer.features.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 8 }}>
            {offer.features.slice(0, 2).map((feature, index) => (
              <Chip key={index} style={{ fontSize: '10px', padding: '2px 8px' }}>
                {feature}
              </Chip>
            ))}
          </div>
        )}

        <Button
          size="m"
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

