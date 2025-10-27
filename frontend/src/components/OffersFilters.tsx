import { FormItem, Input, Button } from '@vkontakte/vkui';
import { OffersFilters } from '@/types';
import { useState, useEffect } from 'react';

interface OffersFiltersProps {
  filters: OffersFilters;
  onChange: (filters: OffersFilters) => void;
  defaultSort?: 'rate' | 'sum' | 'term';
}

export default function OffersFiltersComponent({ 
  filters, 
  onChange, 
  defaultSort = 'rate'
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

  const handleSortChange = (sortType: 'rate' | 'sum' | 'term') => {
    onChange({ ...filters, sort: sortType, page: 1 });
  };

  const currentSort = filters.sort || defaultSort;

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

      <FormItem top="Сортировка" style={{ margin: 'var(--space-sm) 0 0 0' }}>
        <div className="segmented">
          <Button
            size="m"
            className={currentSort === 'rate' ? 'is-active sort-rate' : 'sort-rate'}
            onClick={() => handleSortChange('rate')}
            style={{ 
              minHeight: isMobile ? '48px' : '40px',
              fontSize: isMobile ? '16px' : '14px'
            }}
          >По ставке</Button>
          <Button
            size="m"
            className={currentSort === 'sum' ? 'is-active sort-sum' : 'sort-sum'}
            onClick={() => handleSortChange('sum')}
            style={{ 
              minHeight: isMobile ? '48px' : '40px',
              fontSize: isMobile ? '16px' : '14px'
            }}
          >По сумме</Button>
          <Button
            size="m"
            className={currentSort === 'term' ? 'is-active sort-term' : 'sort-term'}
            onClick={() => handleSortChange('term')}
            style={{ 
              minHeight: isMobile ? '48px' : '40px',
              fontSize: isMobile ? '16px' : '14px'
            }}
          >По сроку</Button>
        </div>
      </FormItem>
    </div>
  );
}

