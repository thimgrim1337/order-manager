import { ColumnDef, RowData } from '@tanstack/react-table';
import { OrderWithDetails } from '@/types/types';
import OrderOptions from '../order-options';
import { formatDate } from '@/helpers/dates';

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
  },
  {
    accessorKey: 'startDate',
    accessorFn: (order) => formatDate(order.startDate, 'dd-MM-yyyy'),
    header: 'Data załadunku',
  },
  {
    accessorKey: 'endDate',
    accessorFn: (order) => formatDate(order.endDate, 'dd-MM-yyyy'),
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
  },
  {
    accessorKey: 'truckID',
    accessorFn: (order) => order.truck,
    header: 'Pojazd',
  },
  {
    accessorKey: 'driverID',
    accessorFn: (order) => order.driver,
    header: 'Kierowca',
  },
  {
    accessorKey: 'customerID',
    accessorFn: (order) => order.customer,
    header: 'Klient',
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
