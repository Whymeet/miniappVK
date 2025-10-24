import { FormItem, Input, Group, Button } from '@vkontakte/vkui';
import { OffersFilters } from '@/types';

interface OffersFiltersProps {
  filters: OffersFilters;
  onChange: (filters: OffersFilters) => void;
  defaultSort?: 'rate' | 'sum' | 'term';
  sortButtonColors?: {
    rate_color: string;
    sum_color: string;
    term_color: string;
  };
}

export default function OffersFiltersComponent({ 
  filters, 
  onChange, 
  defaultSort = 'rate',
  sortButtonColors = {
    rate_color: '#ac6d3a',
    sum_color: '#d4a574',
    term_color: '#8d5628'
  }
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
          gap: '8px'
        }}>
          <Button
            size="m"
            mode={currentSort === 'rate' ? 'primary' : 'secondary'}
            onClick={() => handleSortChange('rate')}
            style={{
              backgroundColor: currentSort === 'rate' ? sortButtonColors.rate_color : 'transparent',
              borderColor: sortButtonColors.rate_color,
              color: currentSort === 'rate' ? '#fff' : sortButtonColors.rate_color,
            }}
          >
            По ставке
          </Button>
          
          <Button
            size="m"
            mode={currentSort === 'sum' ? 'primary' : 'secondary'}
            onClick={() => handleSortChange('sum')}
            style={{
              backgroundColor: currentSort === 'sum' ? sortButtonColors.sum_color : 'transparent',
              borderColor: sortButtonColors.sum_color,
              color: currentSort === 'sum' ? '#fff' : sortButtonColors.sum_color,
            }}
          >
            По сумме
          </Button>
          
          <Button
            size="m"
            mode={currentSort === 'term' ? 'primary' : 'secondary'}
            onClick={() => handleSortChange('term')}
            style={{
              backgroundColor: currentSort === 'term' ? sortButtonColors.term_color : 'transparent',
              borderColor: sortButtonColors.term_color,
              color: currentSort === 'term' ? '#fff' : sortButtonColors.term_color,
            }}
          >
            По сроку
          </Button>
        </div>
      </FormItem>
    </Group>
  );
}

