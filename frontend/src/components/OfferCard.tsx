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
    <Card mode="shadow" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Div style={{ padding: 'var(--space-md)', display: 'grid', gap: 'var(--space-sm)', height: '100%' }}>
        {/* Шапка */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
          <Avatar src={offer.logo_url} size={36} />
          <Title level="3" weight="2" style={{ fontSize: 'var(--text-md)', margin: 0 }}>
            {offer.partner_name}
          </Title>
        </div>

        {/* Ставка — всегда черная */}
        <Text weight="3" style={{ fontSize: 'var(--text-xl)', color: 'var(--text)' }}>
          {offer.rate_text}
        </Text>

        {/* Параметры */}
        <div style={{ display: 'grid', gap: 6 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Text style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>Сумма</Text>
            <Text weight="2" style={{ fontSize: 'var(--text-sm)' }}>
              {formatMoney(offer.sum_min)}–{formatMoney(offer.sum_max)}
            </Text>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Text style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>Срок</Text>
            <Text weight="2" style={{ fontSize: 'var(--text-sm)' }}>
              {formatTerm(offer.term_min)}–{formatTerm(offer.term_max)}
            </Text>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Text style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>Одобрение</Text>
            <Text weight="2" style={{ fontSize: 'var(--text-sm)' }}>{offer.approval_time}</Text>
          </div>
        </div>

        {/* Чипы */}
        {!!offer.features.length && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-xs)' }}>
            {offer.features.slice(0, 2).map((feature, i) => <Chip key={i}>{feature}</Chip>)}
          </div>
        )}

        {/* CTA */}
        <Button
          size="m"
          stretched
          mode="primary"
          onClick={() => onApply(offer.id)}
          style={{ marginTop: 'auto', fontSize: 'var(--text-base)' }}
        >
          {ctaText}
        </Button>
      </Div>
    </Card>
  );
}
