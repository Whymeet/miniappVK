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
    <Card mode="shadow" style={{ marginBottom: 12 }}>
      <Div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
          <Avatar src={offer.logo_url} size={64} />
          <div style={{ marginLeft: 12, flex: 1 }}>
            <Title level="3" weight="2">{offer.partner_name}</Title>
            <Text weight="3" style={{ color: 'var(--color-primary)' }}>
              {offer.rate_text}
            </Text>
          </div>
        </div>

        <div style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text weight="2">Сумма:</Text>
            <Text>{formatMoney(offer.sum_min)} - {formatMoney(offer.sum_max)}</Text>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text weight="2">Срок:</Text>
            <Text>{formatTerm(offer.term_min)} - {formatTerm(offer.term_max)}</Text>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text weight="2">Одобрение:</Text>
            <Text>{offer.approval_time}</Text>
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
          {offer.features.map((feature, index) => (
            <Chip key={index} mode="outline">
              {feature}
            </Chip>
          ))}
        </div>

        <Button
          size="l"
          stretched
          mode="primary"
          onClick={() => onApply(offer.id)}
        >
          {ctaText}
        </Button>
      </Div>
    </Card>
  );
}

