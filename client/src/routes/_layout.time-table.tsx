import { createFileRoute, useLoaderData } from '@tanstack/react-router';
import { useMemo } from 'react';
import countriesQueryOptions from '@/features/OrderForm/queries/countriesQuery';
import trucksQueryOptions from '@/features/OrderForm/queries/trucksQuery';
import {
  formatDate,
  getTwoWeekDays,
  getFirstDay,
  getLastDay,
  getWeekNumber,
} from '@/helpers/dates';

import TimeTablePagination from '@/features/TimeTable/components/time-table-pagination';
import { useQuery, useSuspenseQueries } from '@tanstack/react-query';
import { TimetableFilters } from '@/types/types';
import getOrderQueryOptions from '@/features/OrderForm/queries/ordersQuery';
import PageHeader from '@/components/ui/typography/page-header';
import driversQueryOptions from '@/features/OrderForm/queries/driversQuery';
import TimeTableHeader from '@/features/TimeTable/components/time-table-header';
import TimeTable from '@/features/TimeTable/components/time-table';

export const Route = createFileRoute('/_layout/time-table')({
  loaderDeps: ({ search }) => ({
    truckID: search.truckID,
    startDate: search.startDate,
  }),
  loader: async ({
    context: { queryClient },
    deps: { truckID, startDate },
  }) => {
    const firstDay = getFirstDay(startDate);
    const lastDay = getLastDay(startDate);
    const weekNumber = getWeekNumber(firstDay);

    await Promise.allSettled([
      queryClient.ensureQueryData(trucksQueryOptions),
      queryClient.ensureQueryData(driversQueryOptions),
      queryClient.ensureQueryData(countriesQueryOptions),
      queryClient.ensureQueryData(
        getOrderQueryOptions({
          startDate: formatDate(firstDay),
          endDate: formatDate(lastDay),
        })
      ),
    ]);

    return {
      truckID,
      firstDay,
      weekNumber,
      lastDay,
    };
  },
  validateSearch: (search: TimetableFilters) => TimetableFilters.parse(search),
  component: TimetablePage,
});

function TimetablePage() {
  const { truckID, firstDay, lastDay } = useLoaderData({
    from: '/_layout/time-table',
  });

  const [{ data: trucks }, { data: countries }, { data: drivers }] =
    useSuspenseQueries({
      queries: [trucksQueryOptions, countriesQueryOptions, driversQueryOptions],
    });

  const { data: orders } = useQuery(
    getOrderQueryOptions({
      truckID,
      startDate: formatDate(firstDay),
      endDate: formatDate(lastDay),
    })
  );

  const days = useMemo(
    () => getTwoWeekDays(firstDay, lastDay),
    [firstDay, lastDay]
  );

  const sortedOrders =
    orders &&
    [...orders.data]
      .sort((a, b) => Date.parse(a.startDate) - Date.parse(b.startDate))
      .sort((a, b) => a.driverID - b.driverID);

  return (
    <div className='container mx-auto p-10'>
      <PageHeader
        h2Text='Harmonogram transportu'
        subText='Tablica czasu operacji transportowych'
        className='mb-10'
      />

      <TimeTableHeader trucks={trucks} drivers={drivers} />

      <TimeTable
        orders={sortedOrders || []}
        countries={countries}
        daysOfWeek={days}
      />
      <TimeTablePagination />

      <TimeTablePagination />
    </div>
  );
}
