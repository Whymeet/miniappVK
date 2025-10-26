import { useQuery } from '@tanstack/react-query';
import { fetchModalSettings } from '@/api/config';

export function useModalSettings() {
  return useQuery({
    queryKey: ['modal-settings'],
    queryFn: fetchModalSettings,
    staleTime: 5 * 60 * 1000, // 5 минут
    gcTime: 10 * 60 * 1000, // 10 минут (новое название в React Query v5)
  });
}
