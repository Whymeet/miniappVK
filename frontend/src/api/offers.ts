import { ApiResponse, OffersResponse, OffersFilters } from '@/types';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

/**
 * Получить список офферов
 */
export async function fetchOffers(
  groupId: string | null,
  filters: OffersFilters
): Promise<ApiResponse<OffersResponse>> {
  const params = new URLSearchParams();
  
  if (groupId) {
    params.append('group_id', groupId);
  }
  
  if (filters.sum_need) {
    params.append('sum_need', filters.sum_need.toString());
  }
  
  if (filters.term_days) {
    params.append('term_days', filters.term_days.toString());
  }
  
  if (filters.sort) {
    params.append('sort', filters.sort);
  }
  
  if (filters.page) {
    params.append('page', filters.page.toString());
  }

  const url = `${API_BASE}/api/offers/?${params.toString()}`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch offers: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Построить URL для редиректа на оффер
 */
export function buildOfferRedirectUrl(
  offerId: string,
  userId: string | null,
  groupId: string | null,
  brand: string | null
): string {
  const params = new URLSearchParams();
  
  if (userId) {
    params.append('vk_user_id', userId);
  }
  
  if (groupId) {
    params.append('group_id', groupId);
  }
  
  if (brand) {
    params.append('brand', brand);
  }

  return `${API_BASE}/api/go/${offerId}/?${params.toString()}`;
}

