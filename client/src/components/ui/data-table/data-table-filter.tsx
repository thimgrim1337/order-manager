import { Table } from '@tanstack/react-table';
import { Input } from '../input';

type DataTableFilter<TData> = {
  globalFilterState: string[];
  table: Table<TData>;
  placeholder: string;
};

export default function DataTableFilter<TData>({
  globalFilterState,
  table,
  placeholder,
}: DataTableFilter<TData>) {
  return (
    <Input
      placeholder={placeholder}
      value={globalFilterState}
      onChange={(event) => table.setGlobalFilter(String(event.target.value))}
      className='max-w-sm'
    />
  );
}
