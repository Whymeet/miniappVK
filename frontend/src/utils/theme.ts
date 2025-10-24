import { BrandPalette, CardGradient } from '@/types';

/**
 * Применить тему бренда через CSS переменные
 */
export function applyTheme(
  palette: BrandPalette, 
  sortButtons?: { rate_color: string; sum_color: string; term_color: string },
  cardGradient?: CardGradient
): void {
  const root = document.documentElement;
  
  // Основные цветовые переменные (используемые в index.css)
  root.style.setProperty('--brand', palette.primary);
  root.style.setProperty('--accent', palette.accent || palette.primary);
  root.style.setProperty('--text', palette.text);
  root.style.setProperty('--text-muted', palette.textSecondary);
  root.style.setProperty('--bg', palette.background);
  root.style.setProperty('--surface', palette.surface);
  
  // Дополнительные цвета
  root.style.setProperty('--color-primary', palette.primary);
  root.style.setProperty('--color-secondary', palette.secondary);
  root.style.setProperty('--color-background', palette.background);
  root.style.setProperty('--color-surface', palette.surface);
  root.style.setProperty('--color-text', palette.text);
  root.style.setProperty('--color-text-secondary', palette.textSecondary);
  root.style.setProperty('--color-accent', palette.accent || palette.primary);
  root.style.setProperty('--color-error', palette.error);
  root.style.setProperty('--color-success', palette.success);
  
  // Цвета кнопок сортировки (если переданы)
  if (sortButtons) {
    root.style.setProperty('--sort-button-rate-color', sortButtons.rate_color);
    root.style.setProperty('--sort-button-sum-color', sortButtons.sum_color);
    root.style.setProperty('--sort-button-term-color', sortButtons.term_color);
  }
  
  // Градиент для карточек (если передан)
  if (cardGradient) {
    root.style.setProperty('--card-gradient-start', cardGradient.start);
    root.style.setProperty('--card-gradient-end', cardGradient.end);
    
    // Добавляем/удаляем класс для включения градиента
    if (cardGradient.enabled) {
      document.body.classList.add('card-gradient-enabled');
    } else {
      document.body.classList.remove('card-gradient-enabled');
    }
  }
  
  // Переменные VKUI для кнопок и акцентов
  root.style.setProperty('--vkui--color_background_accent', palette.accent || palette.primary);
  root.style.setProperty('--vkui--color_text_accent', palette.accent || palette.primary);
  root.style.setProperty('--vkui--color_background_accent_themed', palette.accent || palette.primary);
  root.style.setProperty('--vkui--color_text_accent_themed', palette.accent || palette.primary);
  
  // Фон приложения VKUI
  root.style.setProperty('--vkui--color_background', palette.background);
  root.style.setProperty('--vkui--color_background_content', palette.background);
  root.style.setProperty('--vkui--color_background_page', palette.background);
  
  // Фон карточек и поверхностей
  root.style.setProperty('--vkui--color_background_secondary', palette.surface);
  root.style.setProperty('--vkui--color_background_tertiary', palette.surface);
  
  // Цвета текста VKUI
  root.style.setProperty('--vkui--color_text_primary', palette.text);
  root.style.setProperty('--vkui--color_text_secondary', palette.textSecondary);
  root.style.setProperty('--vkui--color_text_subhead', palette.textSecondary);
  
  // Применяем цвет фона к body
  document.body.style.backgroundColor = palette.background;
  document.body.style.color = palette.text;
}

