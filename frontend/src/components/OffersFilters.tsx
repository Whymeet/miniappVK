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
      <FormItem top="Нужная сумма">
        <Input
          type="number"
          placeholder="Например, 10000"
          value={filters.sum_need || ''}
          onChange={handleSumChange}
        />
      </FormItem>

      <FormItem top="Срок (дней)">
        <Input
          type="number"
          placeholder="Например, 30"
          value={filters.term_days || ''}
          onChange={handleTermChange}
        />
      </FormItem>

      <FormItem top="Сортировка">
        <Select
          value={filters.sort || defaultSort}
          onChange={handleSortChange}
        >
          <option value="rate">По ставке</option>
          <option value="sum">По сумме</option>
          <option value="term">По сроку</option>
        </Select>
      </FormItem>
    </Group>
  );
}

