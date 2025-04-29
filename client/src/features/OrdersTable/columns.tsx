import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/primitives/button';
import { OrderWithDetails } from '@/types/types';
import OrderOptions from './components/order-options';

export const columns: ColumnDef<OrderWithDetails>[] = [
  {
    accessorKey: 'orderNr',
    header: 'Nr zlecenia',
  },
  {
    accessorKey: 'startDate',
    header: ({ column }) => {
      return (
        <Button
          variant={'ghost'}
          className={'bg-transparent'}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Data załadunku
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
  },
  {
    accessorKey: 'endDate',
    header: 'Data rozładunku',
  },
  {
    accessorKey: 'loadingPlaces',
    accessorFn: (order) => order.loadingPlaces[0]?.name,
    header: 'Miejsca załadunku',
  },
  {
    accessorKey: 'unloadingPlaces',
    accessorFn: (order) => order.unloadingPlaces[0]?.name,
    header: 'Miejsca rozładunku',
  },
  {
    accessorKey: 'status.name',
    header: 'Status',
  },
  {
    accessorKey: 'truck.plate',
    header: 'Pojazd',
  },
  {
    accessorKey: 'driver',
    accessorFn: (order) => `${order.driver.firstName} ${order.driver.lastName}`,
    header: 'Kierowca',
  },
  {
    id: 'customer',
    accessorKey: 'customer.name',
    header: 'Klient',
  },
  {
    accessorKey: 'priceCurrency',
    header: () => <div className='text-right'>Cena w walucie</div>,
    cell: ({ row }) => {
      const price = parseFloat(row.getValue('priceCurrency'));
      const formatted = new Intl.NumberFormat('pl-PL').format(price);
      return <div className='text-right font-medium'>{formatted}</div>;
    },
  },

  {
    accessorKey: 'currency',
    header: () => <div className='text-right'>Waluta</div>,
    cell: ({ row }) => (
      <div className='text-right font-medium'>{row.getValue('currency')}</div>
    ),
  },
  {
    accessorKey: 'pricePLN',
    header: ({ column }) => {
      return (
        <Button
          variant={'ghost'}
          className={'bg-transparent'}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Cena w PLN
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
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
