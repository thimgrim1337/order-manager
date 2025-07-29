import { Button } from '@/components/ui/primitives/button';
import DebouncedInput from '../debounced-input';
import { useFilters } from '../../hooks/useFilters';

type DataTableFilter = {
  placeholder: string;
  onResetFilters: () => Promise<void>;
};

export default function DataTableFilter({ placeholder }: DataTableFilter) {
  const { filters, setFilters, resetFilters } = useFilters('/_layout/orders');
  return (
    <div className='flex gap-2'>
      <DebouncedInput
        className='max-w-sm'
        onChange={(value) => {
          setFilters({
            globalFilters: typeof value === 'string' ? value : value.toString(),
          });
        }}
        placeholder={placeholder}
        value={filters.globalFilters ?? ''}
      />
      <Button onClick={resetFilters}>Reset</Button>
    </div>
  );
}
