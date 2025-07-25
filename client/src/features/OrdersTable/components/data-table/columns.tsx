import { ColumnDef, RowData } from '@tanstack/react-table';
import { OrderWithDetails } from '@/types/types';
import OrderOptions from '../order-options';

declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    filterKey?: keyof TData;
    filterVariant?: 'text' | 'number';
  }
}

export const columns: ColumnDef<OrderWithDetails>[] = [
  {
    accessorKey: 'orderNr',
    header: 'Nr zlecenia',
    meta: { filterKey: 'orderNr', filterVariant: 'text' },
  },
  {
    accessorKey: 'startDate',
    header: 'Data załadunku',
  },
  {
    accessorKey: 'endDate',
    header: 'Data rozładunku',
  },
  {
    accessorKey: 'loadingCity',
    header: 'Miejsca załadunku',
  },
  {
    accessorKey: 'unloadingCity',
    header: 'Miejsca rozładunku',
  },
  {
    accessorKey: 'statusID',
    accessorFn: (order) => order.status,
    header: 'Status',
    meta: { filterKey: 'statusID', filterVariant: 'number' },
  },
  {
    accessorKey: 'truckID',
    accessorFn: (order) => order.truck,
    header: 'Pojazd',
    meta: { filterKey: 'truckID', filterVariant: 'number' },
  },
  {
    accessorKey: 'driverID',
    accessorFn: (order) => order.driver,
    header: 'Kierowca',
    meta: { filterKey: 'driverID', filterVariant: 'number' },
  },
  {
    accessorKey: 'customerID',
    accessorFn: (order) => order.customer,
    header: 'Klient',
    meta: { filterKey: 'customerID', filterVariant: 'number' },
  },
  {
    accessorKey: 'priceCurrency',
    header: 'Cena',
    cell: ({ row }) => {
      const price = parseFloat(row.getValue('priceCurrency'));
      const formatted = new Intl.NumberFormat('pl-PL').format(price);
      return <div className='text-right font-medium'>{formatted}</div>;
    },
  },

  {
    accessorKey: 'currency',
    header: 'Waluta',
    cell: ({ row }) => (
      <div className='text-right font-medium'>{row.getValue('currency')}</div>
    ),
  },
  {
    accessorKey: 'pricePLN',
    header: 'Cena w PLN',
    cell: ({ row }) => {
      const price = parseFloat(row.getValue('pricePLN'));

      const formatted = new Intl.NumberFormat('pl-PL', {
        style: 'currency',
        currency: 'PLN',
      }).format(price);
      return (
        <div className='text-right font-medium text-red-600 '>{formatted}</div>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const order = row.original;

      return <OrderOptions order={order} />;
    },
  },
];
