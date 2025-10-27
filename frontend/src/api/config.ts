import { ApiResponse, BrandConfig } from '@/types';

export const platform = import.meta.env.VITE_PLATFORM || 'desktop';
export const API_BASE = import.meta.env.VITE_API_BASE || 'https://kybyshka-dev.ru/api';

/**
 * Получить конфигурацию бренда
 */
export async function fetchConfig(
  groupId: string | null,
  brand: string | null
): Promise<ApiResponse<BrandConfig>> {
  const params = new URLSearchParams();
  
  if (groupId) {
    params.append('group_id', groupId);
  }
  
  if (brand) {
    params.append('brand', brand);
  }

  const url = `${API_BASE}/config/?${params.toString()}`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch config: ${response.statusText}`);
  }
  
  return response.json();
}

