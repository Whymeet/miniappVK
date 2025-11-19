import { FormItem, Input } from '@vkontakte/vkui';
import { OffersFilters } from '@/types';
import { useState, useEffect } from 'react';

interface OffersFiltersProps {
  filters: OffersFilters;
  onChange: (filters: OffersFilters) => void;
  defaultSort?: 'rate' | 'sum' | 'term';
}

export default function OffersFiltersComponent({ 
  filters, 
  onChange
}: OffersFiltersProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 480);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSumChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseInt(e.target.value) : undefined;
    onChange({ ...filters, sum_need: value, page: 1 });
  };

  const handleTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseInt(e.target.value) : undefined;
    onChange({ ...filters, term_days: value, page: 1 });
  };

  return (
    <div>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', 
        gap: 'var(--space-md)' 
      }}>
        <FormItem top="Нужная сумма" style={{ margin: 0 }}>
          <Input 
            type="number" 
            placeholder="10000" 
            value={filters.sum_need || ''} 
            onChange={handleSumChange}
            style={{ fontSize: '16px' }} // Предотвращение зума на iOS
          />
        </FormItem>
        <FormItem top="Срок (дней)" style={{ margin: 0 }}>
          <Input 
            type="number" 
            placeholder="30" 
            value={filters.term_days || ''} 
            onChange={handleTermChange}
            style={{ fontSize: '16px' }} // Предотвращение зума на iOS
          />
        </FormItem>
      </div>
    </div>
  );
}