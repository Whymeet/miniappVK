import { useQuery } from '@tanstack/react-query';
import { fetchConfig } from '@/api/config';
import { BrandConfig } from '@/types';

/**
 * Хук для получения конфигурации бренда
 */
export function useConfig(groupId: string | null, brand: string | null) {
  return useQuery<{ data: BrandConfig }>({
    queryKey: ['config', groupId, brand],
    queryFn: () => fetchConfig(groupId, brand),
    staleTime: 5 * 60 * 1000, // 5 минут
    retry: 2,
  });
}

