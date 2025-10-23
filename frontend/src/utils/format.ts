/**
 * Форматирование суммы в рубли
 */
export function formatMoney(amount: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
  }).format(amount);
}

/**
 * Форматирование срока займа
 */
export function formatTerm(days: number): string {
  if (days < 30) {
    return `${days} ${pluralize(days, 'день', 'дня', 'дней')}`;
  }
  
  if (days < 365) {
    const months = Math.floor(days / 30);
    return `${months} ${pluralize(months, 'месяц', 'месяца', 'месяцев')}`;
  }
  
  const years = Math.floor(days / 365);
  return `${years} ${pluralize(years, 'год', 'года', 'лет')}`;
}

/**
 * Плюрализация русских слов
 */
export function pluralize(count: number, one: string, few: string, many: string): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  
  if (mod10 === 1 && mod100 !== 11) {
    return one;
  }
  
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) {
    return few;
  }
  
  return many;
}

