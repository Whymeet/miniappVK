import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Spinner,
  Placeholder,
  Pagination,
  Text,
} from '@vkontakte/vkui';
import { Icon28MoneyCircleOutline } from '@vkontakte/icons';

import { BrandConfig, LaunchParams, OffersFilters } from '@/types';
import { useOffers } from '@/hooks/useOffers';
import { buildOfferRedirectUrl } from '@/api/offers';
import OfferCard from '@/components/OfferCard';
import AllowMessagesButton from '@/components/AllowMessagesButton';
import Logo from '@/components/Logo';

interface OffersPageProps {
  config: BrandConfig;
  launchParams: LaunchParams;
}

export default function OffersPage({ config, launchParams }: OffersPageProps) {
  const [filters, setFilters] = useState<OffersFilters>({
    sort: config.features.default_sort,
    page: 1,
  });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 480);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { data, isLoading, error } = useOffers(launchParams.groupId, filters);

  const handleApplyOffer = async (offerId: string) => {
    const url = buildOfferRedirectUrl(
      offerId,
      launchParams.userId,
      launchParams.groupId,
      config.brand
    );

    // Для iOS VK Mini Apps: просто заменяем текущую страницу
    // Это работает везде: iOS Safari, Android Chrome, Desktop
    window.location.href = url;
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="page-stack">
      {/* Лого и заголовок */}
      <div className="section" style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        gap: '12px', 
        padding: isMobile ? 'var(--space-sm)' : 'var(--space-md)',
        flexDirection: isMobile ? 'column' : 'row'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px',
          width: isMobile ? '100%' : 'auto',
          justifyContent: isMobile ? 'center' : 'flex-start'
        }}>
          <Logo
            src={config.logo_url}
            alt={config.name}
            style={{ 
              maxWidth: isMobile ? 48 : 60, 
              height: isMobile ? 48 : 60, 
              objectFit: 'contain' 
            }}
          />
          <Text style={{ 
            fontSize: isMobile ? 'var(--text-md)' : 'var(--text-lg)', 
            fontWeight: 600, 
            color: 'var(--text-primary)',
            textAlign: isMobile ? 'center' : 'left'
          }}>
            Кубышка займ
          </Text>
        </div>
        {config.vk_button?.group_url && (
          <a
            href={config.vk_button.group_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              backgroundColor: config.vk_button.button_color,
              color: '#FFFFFF',
              padding: isMobile ? '10px 20px' : '8px 16px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: isMobile ? 'var(--text-sm)' : 'var(--text-sm)',
              fontWeight: 600,
              whiteSpace: 'nowrap',
              transition: 'opacity 0.2s',
              width: isMobile ? '100%' : 'auto',
              textAlign: 'center',
              display: 'block'
            }}
            onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => e.currentTarget.style.opacity = '0.8'}
            onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => e.currentTarget.style.opacity = '1'}
          >
            МЫ В ВК
          </a>
        )}
      </div>

      {/* Надпись под хедером */}
      {config.copy.header_caption && (
        <div style={{ 
          textAlign: 'center', 
          padding: isMobile ? 'var(--space-xs) var(--space-sm)' : 'var(--space-sm) var(--space-md)',
          marginTop: '-8px'
        }}>
          <Text style={{ 
            fontSize: isMobile ? 'var(--text-md)' : 'var(--text-lg)', 
            fontWeight: 600,
            color: 'var(--text-primary)'
          }}>
            {config.copy.header_caption}
          </Text>
        </div>
      )}

      {/* Заголовок "Лучшие предложения" */}
      <div style={{ 
        textAlign: 'center', 
        padding: isMobile ? 'var(--space-md) var(--space-sm) var(--space-sm)' : 'var(--space-lg) var(--space-md) var(--space-md)',
      }}>
        <Text style={{ 
          fontSize: isMobile ? 'var(--text-lg)' : 'var(--text-xl)', 
          fontWeight: 700,
          color: 'var(--text-primary)'
        }}>
          Лучшие предложения
        </Text>
      </div>

      {/* Список офферов */}
      {isLoading && (
        <div className="section" style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
          <Spinner size="large" />
        </div>
      )}

      {error && (
        <div className="section">
          <Placeholder
            icon={<Icon28MoneyCircleOutline />}
            header="Ошибка загрузки"
          >
            Не удалось загрузить предложения
          </Placeholder>
        </div>
      )}

      {data && data.data.results.length === 0 && (
        <div className="section">
          <Placeholder
            icon={<Icon28MoneyCircleOutline />}
            header="Нет предложений"
          >
            Попробуйте изменить параметры фильтров
          </Placeholder>
        </div>
      )}

      {data && (
        <div className="section">
          <div style={{ 
            padding: isMobile ? '0 var(--space-sm) var(--space-sm)' : '0 var(--space-md) var(--space-md)',
            textAlign: 'left'
          }}>
            <Text style={{ 
              fontSize: isMobile ? 'var(--text-lg)' : 'var(--text-xl)', 
              fontWeight: 700,
              color: 'var(--text-primary)'
            }}>
              Лучшие предложения
            </Text>
          </div>
          <div className="grid-offers">
            {data.data.results.map((offer) => (
              <OfferCard
                key={offer.id}
                offer={offer}
                onApply={handleApplyOffer}
                ctaText={config.copy.cta}
                userId={launchParams.userId}
              />
            ))}
          </div>
          {data.data.total_pages > 1 && (
            <div style={{ marginTop: 'var(--space-md)' }}>
              <Pagination
                currentPage={filters.page || 1}
                siblingCount={isMobile ? 0 : 1}
                boundaryCount={isMobile ? 1 : 1}
                totalPages={data.data.total_pages}
                onChange={handlePageChange}
              />
            </div>
          )}
        </div>
      )}

      {/* Кнопка разрешения уведомлений */}
      {config.features.enable_messages && launchParams.groupId && launchParams.userId && (
        <div className="section" style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ maxWidth: '400px', width: '100%' }}>
            <AllowMessagesButton 
              groupId={launchParams.groupId}
              userId={launchParams.userId}
              launchParams={(launchParams as any).rawParams}
            />
          </div>
        </div>
      )}

      {/* Политика конфиденциальности */}
      <div style={{ 
        textAlign: 'center', 
        padding: isMobile ? 'var(--space-sm)' : 'var(--space-md)' 
      }}>
        <Link 
          to="/policy" 
          style={{ 
            color: 'var(--text-muted)', 
            textDecoration: 'none',
            fontSize: isMobile ? 'var(--text-xs)' : 'var(--text-sm)',
          }}
        >
          Политика конфиденциальности
        </Link>
      </div>

      {/* Юридическая информация */}
      <div style={{ 
        textAlign: 'center', 
        padding: isMobile ? 'var(--space-md) var(--space-sm)' : 'var(--space-lg) var(--space-md)',
        borderTop: '1px solid #E5E7EB',
        marginTop: 'var(--space-xl)'
      }}>
        {/* Дисклеймер */}
        {config.features.show_disclaimer && (
          <div className="alert" style={{ marginBottom: 'var(--space-md)' }}>
            <span className="alert__icon">ℹ️</span>
            <Text style={{ 
              fontSize: isMobile ? 'var(--text-xs)' : 'var(--text-sm)', 
              lineHeight: '1.5'
            }}>
              {config.copy.disclaimer}
            </Text>
          </div>
        )}
        
        <Text style={{ 
          fontSize: isMobile ? '10px' : 'var(--text-xs)', 
          color: 'var(--text-muted)',
          lineHeight: '1.6',
          display: 'block',
          marginBottom: 'var(--space-sm)'
        }}>
          Сервис "Кубышка займ" не является финансовым учреждением, банком или кредитором. 
          Услуги посредника предоставляет ООО "ЛИДСТЕХ". ПСК 0% - 292%.
        </Text>
        <Text style={{ 
          fontSize: isMobile ? '10px' : 'var(--text-xs)', 
          color: 'var(--text-muted)',
          lineHeight: '1.6',
          display: 'block',
          marginBottom: 'var(--space-sm)'
        }}>
          Информация на сайте: https://kubyshka-zaim.ru/
        </Text>
        <Text style={{ 
          fontSize: isMobile ? '10px' : 'var(--text-xs)', 
          color: 'var(--text-muted)',
          lineHeight: '1.6',
          display: 'block'
        }}>
          © 2025 Кубышка займ. Все права защищены.
        </Text>
      </div>
    </div>
  );
}

