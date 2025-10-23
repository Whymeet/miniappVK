import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Group,
  Header,
  Div,
  Spinner,
  Placeholder,
  Pagination,
  Banner,
  Text,
} from '@vkontakte/vkui';
import { Icon28MoneyCircleOutline } from '@vkontakte/icons';

import { BrandConfig, LaunchParams, OffersFilters } from '@/types';
import { useOffers } from '@/hooks/useOffers';
import { buildOfferRedirectUrl } from '@/api/offers';
import OfferCard from '@/components/OfferCard';
import OffersFiltersComponent from '@/components/OffersFilters';
import AllowMessagesButton from '@/components/AllowMessagesButton';

interface OffersPageProps {
  config: BrandConfig;
  launchParams: LaunchParams;
}

export default function OffersPage({ config, launchParams }: OffersPageProps) {
  const [filters, setFilters] = useState<OffersFilters>({
    sort: config.features.default_sort,
    page: 1,
  });

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
    <>
      {/* Лого и заголовок */}
      <Group>
        <Div style={{ textAlign: 'center' }}>
          <img 
            src={config.logo_url} 
            alt={config.name}
            style={{ maxWidth: '200px', height: 'auto' }}
          />
          <Text style={{ marginTop: 8, color: 'var(--color-text-secondary)' }}>
            {config.copy.subtitle}
          </Text>
        </Div>
      </Group>

      {/* Фильтры */}
      {config.features.show_filters && (
        <Group header={<Header mode="secondary">Параметры займа</Header>}>
          <OffersFiltersComponent
            filters={filters}
            onChange={setFilters}
            defaultSort={config.features.default_sort}
          />
        </Group>
      )}

      {/* Дисклеймер */}
      {config.features.show_disclaimer && (
        <Group>
          <Banner mode="image" background="var(--color-surface)">
            <Text style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
              {config.copy.disclaimer}
            </Text>
          </Banner>
        </Group>
      )}

      {/* Список офферов */}
      <Group header={<Header mode="secondary">Предложения</Header>}>
        {isLoading && (
          <Div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
            <Spinner size="large" />
          </Div>
        )}

        {error && (
          <Placeholder
            icon={<Icon28MoneyCircleOutline />}
            header="Ошибка загрузки"
          >
            Не удалось загрузить предложения
          </Placeholder>
        )}

        {data && data.data.results.length === 0 && (
          <Placeholder
            icon={<Icon28MoneyCircleOutline />}
            header="Нет предложений"
          >
            Попробуйте изменить параметры фильтров
          </Placeholder>
        )}

        {data && data.data.results.map((offer) => (
          <OfferCard
            key={offer.id}
            offer={offer}
            onApply={handleApplyOffer}
            ctaText={config.copy.cta}
          />
        ))}

        {/* Пагинация */}
        {data && data.data.total_pages > 1 && (
          <Div>
            <Pagination
              currentPage={filters.page || 1}
              siblingCount={1}
              boundaryCount={1}
              totalPages={data.data.total_pages}
              onChange={handlePageChange}
            />
          </Div>
        )}
      </Group>

      {/* Кнопка разрешения уведомлений */}
      {config.features.enable_messages && launchParams.groupId && launchParams.userId && (
        <Group>
          <Div>
            <AllowMessagesButton 
              groupId={launchParams.groupId}
              userId={launchParams.userId}
            />
          </Div>
        </Group>
      )}

      {/* Политика конфиденциальности */}
      <Group>
        <Div style={{ textAlign: 'center' }}>
          <Link 
            to="/policy" 
            style={{ 
              color: 'var(--color-text-secondary)', 
              textDecoration: 'none',
              fontSize: 13,
            }}
          >
            Политика конфиденциальности
          </Link>
        </Div>
      </Group>
    </>
  );
}

