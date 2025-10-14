import { Button } from '@/components/ui/primitives/button';
import DebouncedInput from '../debounced-input';
import { useFilters } from '../../hooks/useFilters';
import { Search } from 'lucide-react';

export default function DataTableFilter() {
  const { filters, setFilters, resetFilters } = useFilters('/_layout/orders');

  return (
    <div className='flex gap-2 items-center'>
      <Search className='text-muted-foreground' />
      <DebouncedInput
        className='max-w-sm border-none'
        onChange={(value) => {
          setFilters({
            globalFilters: typeof value === 'string' ? value : value.toString(),
          });
        }}
        placeholder={`Szukaj zleceń....`}
        value={filters.globalFilters ?? ''}
      />
      <Button onClick={resetFilters} variant={'outline'}>
        Reset
      </Button>
    </div>
  );
}
