import { Button } from '@/components/ui/button';
import countriesQueryOptions from '@/features/OrderForm/queries/countriesQuery';
import trucksQueryOptions from '@/features/OrderForm/queries/trucksQuery';
import { fetchOrders } from '@/features/TimeTable/queries/ordersQuery';
import TimeTable from '@/features/TimeTable/TimeTable';
import {
  getDaysOfWeek,
  getFirstDayOfWeek,
  getLastDayOfWeek,
  getToday,
} from '@/helpers/dates';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { MouseEvent, Suspense, useState } from 'react';

export const Route = createFileRoute('/time-table')({
  loader: ({ context: { queryClient } }) => {
    queryClient.ensureQueryData(trucksQueryOptions);
    queryClient.ensureQueryData(countriesQueryOptions);
  },
  component: RouteComponent,
});
const today = getToday();

function RouteComponent() {
  const [selectedTruck, setSelectedTruck] = useState<number>(1);
  const [selectedDate, setSelectedDate] = useState<string>(today);

  const firstDayOfWeek = getFirstDayOfWeek(selectedDate);
  const lastDayOfWeek = getLastDayOfWeek(selectedDate);
  const daysOfWeek = getDaysOfWeek(firstDayOfWeek, lastDayOfWeek);

  const { data: orders } = useSuspenseQuery({
    queryKey: ['orders', selectedTruck],
    queryFn: () =>
      fetchOrders(
        selectedTruck,
        daysOfWeek[0].date,
        daysOfWeek[daysOfWeek.length - 1].date
      ),
  });
  const { data: trucks } = useSuspenseQuery(trucksQueryOptions);
  const { data: countries } = useSuspenseQuery(countriesQueryOptions);

  function handleClick(e: MouseEvent<HTMLUListElement>) {
    if (e.target instanceof HTMLElement && selectedTruck !== +e.target.id)
      setSelectedTruck(+e.target.id);
  }

  return (
    <div className='container mx-auto py-10'>
      <Suspense fallback={<h1>Loading orders...</h1>}>
        <ul className='flex gap-2 p-2' onClick={handleClick}>
          {trucks.map((truck) => (
            <li key={truck.id}>
              <Button
                variant={'outline'}
                className={truck.id === selectedTruck ? 'border-gray-950' : ''}
                id={truck.id.toString()}
              >
                {truck.plate}
              </Button>
            </li>
          ))}
        </ul>
        <TimeTable
          orders={orders}
          countries={countries}
          daysOfWeek={daysOfWeek}
        />
      </Suspense>
    </div>
  );
}
