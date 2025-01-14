import { Order } from '@/types/order';
import { ColumnDef } from '@tanstack/react-table';

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
    accessorKey: 'orderLoadingPlaces',
    accessorFn: (order) =>
      order.orderLoadingPlaces[0] && order.orderLoadingPlaces[0].place.name,
    header: 'Miejsca załadunku',
  },
  {
    accessorKey: 'orderUnloadingPlaces',
    accessorFn: (order) =>
      order.orderUnloadingPlaces[0] && order.orderLoadingPlaces[0].place.name,
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
    accessorKey: 'customer.name',
    header: 'Klient',
  },
  {
    accessorKey: 'price',
    header: () => <div className='text-right'>Cena w walucie</div>,
    cell: ({ row }) => {
      const price = parseFloat(row.getValue('price'));
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
    accessorKey: 'price',
    header: () => <div className='text-right'>Cena w PLN</div>,
    cell: ({ row }) => {
      const price = parseFloat(row.getValue('price'));
      const currency = row.getValue('currency');

      const calculatedPrice = currency === 'EUR' ? price * 4.25 : price;

      const formatted = new Intl.NumberFormat('pl-PL', {
        style: 'currency',
        currency: 'PLN',
      }).format(calculatedPrice);
      return (
        <div className='text-right font-medium text-red-600 '>{formatted}</div>
      );
    },
  },
];
