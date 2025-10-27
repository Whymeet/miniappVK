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
import OffersFiltersComponent from '@/components/OffersFilters';
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

  const handleApplyOffer = (offerId: string) => {
    const url = buildOfferRedirectUrl(
      offerId,
      launchParams.userId,
      launchParams.groupId,
      config.brand
    );
    window.open(url, '_blank');
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

      {/* Фильтры */}
      {config.features.show_filters && (
        <div className="section">
          <OffersFiltersComponent
            filters={filters}
            onChange={setFilters}
            defaultSort={config.features.default_sort}
          />
        </div>
      )}

      {/* Дисклеймер */}
      {config.features.show_disclaimer && (
        <div className="alert">
          <span className="alert__icon">ℹ️</span>
          <Text style={{ 
            fontSize: isMobile ? 'var(--text-xs)' : 'var(--text-sm)', 
            lineHeight: '1.5'
          }}>
            {config.copy.disclaimer}
          </Text>
        </div>
      )}

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
          <div className="grid-offers">
            {data.data.results.map((offer) => (
              <OfferCard
                key={offer.id}
                offer={offer}
                onApply={handleApplyOffer}
                ctaText={config.copy.cta}
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

