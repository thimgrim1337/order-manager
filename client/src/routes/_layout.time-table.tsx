import countriesQueryOptions from '@/features/OrderForm/queries/countriesQuery';
import trucksQueryOptions from '@/features/OrderForm/queries/trucksQuery';
import { fetchOrdersByTruckAndDates } from '@/features/TimeTable/queries/ordersQuery';
import TimeTable from '@/features/TimeTable/components/time-table';
import {
  getDaysOfWeek,
  getFirstDayOfWeek,
  getLastDayOfWeek,
  getToday,
  getWeekNumber,
} from '@/helpers/dates';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { MouseEvent, useState } from 'react';
import TimeTableHeader from '@/features/TimeTable/components/time-table-header';
import TimeTablePagination from '@/features/TimeTable/components/time-table-pagination';

export const Route = createFileRoute('/_layout/time-table')({
  loader: ({ context: { queryClient } }) => {
    queryClient.ensureQueryData(trucksQueryOptions);
    queryClient.ensureQueryData(countriesQueryOptions);
  },
  component: TimetablePage,
  pendingComponent: () => <h1>Loading...</h1>,
});
const today = getToday();

function TimetablePage() {
  const [selectedTruck, setSelectedTruck] = useState<number>(1);
  const [selectedWeek, setSelectedWeek] = useState<string>(today);

  const firstDayOfWeek = getFirstDayOfWeek(selectedWeek);
  const lastDayOfWeek = getLastDayOfWeek(selectedWeek);
  const daysOfWeek = getDaysOfWeek(firstDayOfWeek, lastDayOfWeek);
  const weekNumber = getWeekNumber(selectedWeek);

  const { data: orders } = useSuspenseQuery({
    queryKey: ['orders', selectedTruck, weekNumber],
    queryFn: () =>
      fetchOrdersByTruckAndDates(
        selectedTruck,
        daysOfWeek[0].date,
        daysOfWeek[daysOfWeek.length - 1].date
      ),
  });
  const { data: trucks } = useSuspenseQuery(trucksQueryOptions);
  const { data: countries } = useSuspenseQuery(countriesQueryOptions);

  function onTruckChange(e: MouseEvent<HTMLUListElement>) {
    if (e.target instanceof HTMLElement && selectedTruck !== +e.target.id)
      setSelectedTruck(+e.target.id);
  }

  function onWeekChange(value: string) {
    setSelectedWeek(value);
  }

  return (
    <div className='container mx-auto py-10'>
      <TimeTableHeader
        trucks={trucks}
        onSelectTruck={onTruckChange}
        selectedTruck={selectedTruck}
      />
      <TimeTable
        orders={orders}
        countries={countries}
        daysOfWeek={daysOfWeek}
        weekNumber={weekNumber}
      />
      <TimeTablePagination selectedWeek={selectedWeek} onClick={onWeekChange} />
    </div>
  );
}
