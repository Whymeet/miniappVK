import { FormItem, Input, Select, Group } from '@vkontakte/vkui';
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

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...filters, sort: e.target.value as 'rate' | 'sum' | 'term', page: 1 });
  };

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

      <FormItem top="Сортировка" style={{ padding: '0 12px' }}>
        <Select
          value={filters.sort || defaultSort}
          onChange={handleSortChange}
          options={[
            { label: 'По ставке', value: 'rate' },
            { label: 'По сумме', value: 'sum' },
            { label: 'По сроку', value: 'term' },
          ]}
        />
      </FormItem>
    </Group>
  );
}

