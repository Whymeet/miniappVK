import { BrandPalette } from '@/types';

/**
 * Применить тему бренда через CSS переменные
 */
export function applyTheme(palette: BrandPalette): void {
  const root = document.documentElement;
  
  // Наши кастомные переменные
  root.style.setProperty('--color-primary', palette.primary);
  root.style.setProperty('--color-secondary', palette.secondary);
  root.style.setProperty('--color-background', palette.background);
  root.style.setProperty('--color-surface', palette.surface);
  root.style.setProperty('--color-text', palette.text);
  root.style.setProperty('--color-text-secondary', palette.textSecondary);
  root.style.setProperty('--color-accent', palette.accent);
  root.style.setProperty('--color-error', palette.error);
  root.style.setProperty('--color-success', palette.success);
  
  // Переменные VKUI для кнопок и акцентов
  root.style.setProperty('--vkui--color_background_accent', palette.primary);
  root.style.setProperty('--vkui--color_text_accent', palette.primary);
  root.style.setProperty('--vkui--color_background_accent_themed', palette.primary);
  root.style.setProperty('--vkui--color_text_accent_themed', palette.primary);
  
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

