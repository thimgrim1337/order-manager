import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Order } from '@/types/types';

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: 'orderNr',
    header: 'Nr zlecenia',
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
    accessorKey: 'loadingPlaces',
    accessorFn: (order) => order.loadingPlaces[0]?.place?.name,
    header: 'Miejsca załadunku',
  },
  {
    accessorKey: 'unloadingPlaces',
    accessorFn: (order) => order.unloadingPlaces[0]?.place?.name,
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

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={'ghost'} className='h-8 w-8 p-0 bg-transparent'>
              <span className='sr-only'>Open menu</span>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Akcje</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => console.log(order)}>
              Szczegóły
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Edytuj</DropdownMenuItem>
            <DropdownMenuItem>Usuń</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
