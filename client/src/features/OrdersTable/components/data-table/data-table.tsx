import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/primitives/table';
import { DataTablePagination } from './data-table-pagination';
import DataTableFilter from './data-table-filter';
import { sortByToState, stateToSortBy } from '@/lib/utils';
import { useFilters } from '../../hooks/useFilters';
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from '@/routes/_layout.orders';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  rowCount: number;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  rowCount,
}: DataTableProps<TData, TValue>) {
  const { filters, setFilters } = useFilters('/_layout/orders');

  const PaginationState = {
    pageIndex: filters.pageIndex ?? DEFAULT_PAGE_INDEX,
    pageSize: filters.pageSize ?? DEFAULT_PAGE_SIZE,
  };

  const SortState = sortByToState(filters.sortBy);

  const table = useReactTable({
    data,
    columns,
    rowCount: rowCount,
    getCoreRowModel: getCoreRowModel(),
    onPaginationChange: (pagination) => {
      setFilters(
        typeof pagination === 'function'
          ? pagination(PaginationState)
          : pagination
      );
    },
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: (sorter) => {
      const newSortingState =
        typeof sorter === 'function' ? sorter(SortState) : sorter;
      return setFilters({ sortBy: stateToSortBy(newSortingState) });
    },
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    state: {
      sorting: SortState,
      pagination: PaginationState,
    },
  });

  return (
    <>
      <div className='py-4'>
        <DataTableFilter />
      </div>

      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : (
                      <>
                        <div
                          className={`flex gap-2 items-center justify-start ${
                            header.column.getCanSort()
                              ? 'cursor-pointer select-none group'
                              : ''
                          } `}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {header.column.getCanSort()
                            ? {
                                asc: (
                                  <ArrowUp className='max-w-4 opacity-0 group-hover:opacity-100' />
                                ),
                                desc: (
                                  <ArrowDown className='max-w-4 opacity-0 group-hover:opacity-100' />
                                ),
                                false: (
                                  <ArrowUpDown className='max-w-4 opacity-0 group-hover:opacity-100' />
                                ),
                              }[header.column.getIsSorted() as string]
                            : null}
                        </div>
                      </>
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className='h-24 text-center'>
                Brak wyników.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <DataTablePagination table={table} />
    </>
  );
}
