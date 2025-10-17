import { ColumnDef } from '@tanstack/react-table';
import { OrderWithDetails } from '@/types/types';
import OrderOptions from '../order-options';
import { formatDate } from '@/helpers/dates';
import StatusBadge from '@/components/status-badge';

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
    header: ' Miejsce załadunku',
  },
  {
    accessorKey: 'unloadingCity',
    header: 'Miejsce rozładunku',
  },
  {
    accessorKey: 'statusID',
    cell: ({ row }) => {
      const statusID = row.getValue('statusID') as number;

      return (
        <StatusBadge statusID={statusID}> {row.original.status}</StatusBadge>
      );
    },
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
    header: 'Cena (PLN)',
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
