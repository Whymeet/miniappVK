import { FormItem, Input, Button } from '@vkontakte/vkui';
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
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-md)' }}>
        <FormItem top="Нужная сумма" style={{ margin: 0 }}>
          <Input type="number" placeholder="10000" value={filters.sum_need || ''} onChange={handleSumChange} />
        </FormItem>
        <FormItem top="Срок (дней)" style={{ margin: 0 }}>
          <Input type="number" placeholder="30" value={filters.term_days || ''} onChange={handleTermChange} />
        </FormItem>
      </div>

      <FormItem top="Сортировка" style={{ margin: 'var(--space-sm) 0 0 0' }}>
        <div className="segmented">
          <Button
            size="m"
            className={currentSort === 'rate' ? 'is-active sort-rate' : 'sort-rate'}
            onClick={() => handleSortChange('rate')}
          >По ставке</Button>
          <Button
            size="m"
            className={currentSort === 'sum' ? 'is-active sort-sum' : 'sort-sum'}
            onClick={() => handleSortChange('sum')}
          >По сумме</Button>
          <Button
            size="m"
            className={currentSort === 'term' ? 'is-active sort-term' : 'sort-term'}
            onClick={() => handleSortChange('term')}
          >По сроку</Button>
        </div>
      </FormItem>
    </div>
  );
}

