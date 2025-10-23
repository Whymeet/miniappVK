import { BrandPalette } from '@/types';

/**
 * Применить тему бренда через CSS переменные
 */
export function applyTheme(palette: BrandPalette): void {
  const root = document.documentElement;
  
  root.style.setProperty('--color-primary', palette.primary);
  root.style.setProperty('--color-secondary', palette.secondary);
  root.style.setProperty('--color-background', palette.background);
  root.style.setProperty('--color-surface', palette.surface);
  root.style.setProperty('--color-text', palette.text);
  root.style.setProperty('--color-text-secondary', palette.textSecondary);
  root.style.setProperty('--color-accent', palette.accent);
  root.style.setProperty('--color-error', palette.error);
  root.style.setProperty('--color-success', palette.success);
}

