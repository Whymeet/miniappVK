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

  const padding = isSmallMobile ? 8 : isMobile ? 10 : 12;

  // 👉 логотипы увеличены
  const logoBoxSize = isSmallMobile ? 72 : isMobile ? 84 : 96;
  const logoRadius = 12;

  const labelIconSize = isSmallMobile ? 30 : 32;

  const ratingFont = isSmallMobile ? 13 : isMobile ? 14 : 14;
  const ratingValueFont = isSmallMobile ? 14 : 15;

  const paramLabelFont = isSmallMobile ? 12 : 13;
  const paramValueFont = isSmallMobile ? 13 : 14;

  const btnFont = isSmallMobile ? 12 : isMobile ? 13 : 13;
  const btnHeight = isSmallMobile ? 40 : 44;

  // Промо-строка в середине карточки
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
          gap: isSmallMobile ? 8 : 10,
        }}
      >
        {/* Сразу логотипный блок, без "5 минут" и т.п. */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: isSmallMobile ? 10 : 12,
            flex: 1,
          }}
        >
          {/* Логотип + иконка справа */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 10,
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

            <div
              style={{
                marginLeft: 'auto',
                width: labelIconSize,
                height: labelIconSize,
                borderRadius: 999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background:
                  'linear-gradient(135deg, rgba(34,197,94,1) 0%, rgba(52,211,153,1) 100%)',
                flexShrink: 0,
              }}
            >
              <svg
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                width={labelIconSize - 8}
                height={labelIconSize - 8}
                style={{ fill: '#ffffff' }}
              >
                <path d="M12 6L16 12L21 8L19 18H5L3 8L8 12L12 6Z" />
              </svg>
            </div>
          </div>

          {/* Рейтинг + параметры + кнопка */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: isSmallMobile ? 8 : 10,
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
                  gap: 2,
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
                gap: isSmallMobile ? 4 : 6,
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

            {/* Без блока "0% в день" */}

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
