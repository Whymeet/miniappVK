// Типы для white-label конфигурации
export interface BrandPalette {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  accent: string;
  error: string;
  success: string;
}

export interface BrandCopy {
  title: string;
  subtitle: string;
  header_caption: string;
  cta: string;
  disclaimer: string;
  policy_title: string;
  policy_text: string;
}

export interface BrandFeatures {
  default_sort: 'rate' | 'term' | 'sum';
  show_filters: boolean;
  show_disclaimer: boolean;
  enable_messages: boolean;
}

export interface SortButtonColors {
  rate_color: string;
  sum_color: string;
  term_color: string;
}

export interface CardGradient {
  enabled: boolean;
  start: string;
  end: string;
}

export interface VkButton {
  group_url: string;
  button_color: string;
}

export interface BrandConfig {
  brand: string;
  name: string;
  palette: BrandPalette;
  logo_url: string;
  copy: BrandCopy;
  features: BrandFeatures;
  sort_buttons: SortButtonColors;
  card_gradient: CardGradient;
  vk_button: VkButton;
}

// Типы для офферов
export interface Offer {
  id: string;
  partner_name: string;
  logo_url: string;
  sum_min: number;
  sum_max: number;
  term_min: number;
  term_max: number;
  rate: number;
  rate_text: string;
  approval_time: string;
  approval_probability: string;
  features: string[];
  redirect_url: string;
}

export interface OffersResponse {
  results: Offer[];
  count: number;
  page: number;
  page_size: number;
  total_pages: number;
}

// Типы для API
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

// Launch params
export interface LaunchParams {
  groupId: string | null;
  userId: string | null;
  brand: string | null;
}

// Фильтры офферов
export interface OffersFilters {
  sum_need?: number;
  term_days?: number;
  sort?: 'rate' | 'sum' | 'term';
  page?: number;
}

