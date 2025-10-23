import { useQuery } from '@tanstack/react-query';
import { fetchOffers } from '@/api/offers';
import { OffersFilters, OffersResponse } from '@/types';

/**
 * Хук для получения списка офферов
 */
export function useOffers(groupId: string | null, filters: OffersFilters) {
  return useQuery<{ data: OffersResponse }>({
    queryKey: ['offers', groupId, filters],
    queryFn: () => fetchOffers(groupId, filters),
    staleTime: 60 * 1000, // 1 минута
    enabled: true,
  });
}

