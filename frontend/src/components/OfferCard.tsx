import { Card, Div, Button } from '@vkontakte/vkui';
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

export default function OfferCard({
  offer,
  onApply,
  ctaText = 'Получить деньги',
  userId,
}: OfferCardProps) {
  const [deviceWidth, setDeviceWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 1024,
  );

  useEffect(() => {
    const onResize = () => setDeviceWidth(window.innerWidth);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const isMobile = deviceWidth <= 420;
  const isSmallMobile = deviceWidth <= 360;

  const handleApply = async () => {
    try {
      await bridge.send('VKWebAppTrackEvent', {
        event_name: 'lead',
        user_id: userId || undefined,
        event_params: {
          offer_id: offer.id,
          partner_name: offer.partner_name,
        },
      } as any);
      console.log('✅ VK Ads lead event sent for offer:', offer.id);
    } catch (error) {
      console.warn('⚠️ Failed to send VK Ads lead event:', error);
    }

    onApply(offer.id);
  };

  // карточка и контент крупнее
  const padding = isSmallMobile ? 10 : isMobile ? 12 : 16;

  // крупный логотип
  const logoBoxSize = isSmallMobile ? 88 : isMobile ? 100 : 120;
  const logoRadius = 14;

  const ratingFont = isSmallMobile ? 14 : isMobile ? 15 : 16;
  const ratingValueFont = isSmallMobile ? 15 : isMobile ? 16 : 17;

  const paramLabelFont = isSmallMobile ? 13 : 14;
  const paramValueFont = isSmallMobile ? 14 : 15;

  const btnFont = isSmallMobile ? 13 : isMobile ? 14 : 15;
  const btnHeight = isSmallMobile ? 44 : 48;

  // Промо-строка
  const promoText =
    offer.features && offer.features.length > 1
      ? offer.features[1]
      : offer.features && offer.features.length > 0
      ? offer.features[0]
      : undefined;

  return (
    <Card
      mode="shadow"
      className="offer-card-gradient"
      style={{
        height: '100%',
        minHeight: isSmallMobile ? 180 : isMobile ? 190 : 210,
        display: 'flex',
        flexDirection: 'column',
        padding,
        borderRadius: 16,
        boxShadow: '0 6px 18px rgba(15, 23, 42, 0.08)',
        backgroundColor: 'var(--vkui--color_background_content)',
      }}
    >
      <Div
        style={{
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          gap: isSmallMobile ? 10 : 12,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: isSmallMobile ? 12 : 14,
            flex: 1,
          }}
        >
          {/* Верхняя часть с логотипом (по центру) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center', // <<< логотип по центру
              gap: 12,
            }}
          >
            <div
              style={{
                width: logoBoxSize,
                height: logoBoxSize,
                borderRadius: logoRadius,
                backgroundColor: 'rgba(148, 163, 184, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                flexShrink: 0,
              }}
            >
              <Logo
                src={offer.logo_url}
                alt={offer.partner_name}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  borderRadius: logoRadius,
                  display: 'block',
                }}
              />
            </div>
          </div>

          {/* Контент: рейтинг + параметры + кнопка */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: isSmallMobile ? 10 : 12,
              flex: 1,
            }}
          >
            {/* Рейтинг */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <span
                style={{
                  fontSize: ratingValueFont,
                  fontWeight: 700,
                  color: 'var(--vkui--color_text_primary)',
                }}
              >
                5.0
              </span>

              <div
                style={{
                  display: 'flex',
                  gap: 3,
                }}
              >
                {Array.from({ length: 5 }).map((_, idx) => (
                  <svg
                    key={idx}
                    viewBox="0 0 24 24"
                    width={ratingFont + 2}
                    height={ratingFont + 2}
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ fill: '#FACC15' }}
                  >
                    <path d="M12 3.172L14.472 8.182L20 8.964L16 12.788L16.944 18.308L12 15.6L7.056 18.308L8 12.788L4 8.964L9.528 8.182L12 3.172Z" />
                  </svg>
                ))}
              </div>
            </div>

            {/* Параметры */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: isSmallMobile ? 6 : 8,
                fontSize: paramLabelFont,
                color: 'var(--vkui--color_text_secondary)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 6,
                }}
              >
                <span>Сумма</span>
                <span
                  style={{
                    fontWeight: 700,
                    fontSize: paramValueFont,
                    color: 'var(--accent)',
                  }}
                >
                  {formatMoney(offer.sum_max)}
                </span>
              </div>

              {promoText && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 6,
                  }}
                >
                  <span>Первый заём</span>
                  <span
                    style={{
                      fontWeight: 700,
                      fontSize: paramValueFont,
                      color: 'var(--vkui--color_text_primary)',
                    }}
                  >
                    {promoText}
                  </span>
                </div>
              )}

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 6,
                }}
              >
                <span>Срок</span>
                <span
                  style={{
                    fontWeight: 700,
                    fontSize: paramValueFont,
                    color: 'var(--vkui--color_text_primary)',
                  }}
                >
                  {formatTerm(offer.term_max)}
                </span>
              </div>
            </div>

            {/* Кнопка */}
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
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                whiteSpace: 'normal',
                lineHeight: 1.25,
                textAlign: 'center',
              }}
            >
              {ctaText}
            </Button>
          </div>
        </div>
      </Div>
    </Card>
  );
}
