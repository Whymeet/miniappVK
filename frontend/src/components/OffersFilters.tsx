import { FormItem, Input, Group, Button } from '@vkontakte/vkui';
import { OffersFilters } from '@/types';

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
    <Group mode="plain">
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(2, 1fr)', 
        gap: '12px',
        padding: '0 12px'
      }}>
        <FormItem top="Нужная сумма" style={{ margin: 0 }}>
          <Input
            type="number"
            placeholder="10000"
            value={filters.sum_need || ''}
            onChange={handleSumChange}
          />
        </FormItem>

        <FormItem top="Срок (дней)" style={{ margin: 0 }}>
          <Input
            type="number"
            placeholder="30"
            value={filters.term_days || ''}
            onChange={handleTermChange}
          />
        </FormItem>
      </div>

      <FormItem top="Сортировка" style={{ padding: '0 12px', margin: '8px 0 0 0' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: '0',
          backgroundColor: '#F3F4F6',
          borderRadius: 'var(--radius-sm)',
          padding: '4px',
          position: 'relative'
        }}>
          <Button
            size="m"
            mode={currentSort === 'rate' ? 'primary' : 'secondary'}
            onClick={() => handleSortChange('rate')}
            style={{
              height: '40px',
              backgroundColor: currentSort === 'rate' ? 'var(--accent)' : 'transparent',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              color: currentSort === 'rate' ? '#fff' : 'var(--text-muted)',
              fontWeight: currentSort === 'rate' ? '600' : '500',
              fontSize: 'var(--text-sm)',
              boxShadow: 'none',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            По ставке
          </Button>
          
          <Button
            size="m"
            mode={currentSort === 'sum' ? 'primary' : 'secondary'}
            onClick={() => handleSortChange('sum')}
            style={{
              height: '40px',
              backgroundColor: currentSort === 'sum' ? 'var(--accent)' : 'transparent',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              color: currentSort === 'sum' ? '#fff' : 'var(--text-muted)',
              fontWeight: currentSort === 'sum' ? '600' : '500',
              fontSize: 'var(--text-sm)',
              boxShadow: 'none',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            По сумме
          </Button>
          
          <Button
            size="m"
            mode={currentSort === 'term' ? 'primary' : 'secondary'}
            onClick={() => handleSortChange('term')}
            style={{
              height: '40px',
              backgroundColor: currentSort === 'term' ? 'var(--accent)' : 'transparent',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              color: currentSort === 'term' ? '#fff' : 'var(--text-muted)',
              fontWeight: currentSort === 'term' ? '600' : '500',
              fontSize: 'var(--text-sm)',
              boxShadow: 'none',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            По сроку
          </Button>
        </div>
      </FormItem>
    </Group>
  );
}

