import { createFileRoute, useLoaderData } from '@tanstack/react-router';
import { lazy, useMemo } from 'react';
import countriesQueryOptions from '@/features/OrderForm/queries/countriesQuery';
import trucksQueryOptions from '@/features/OrderForm/queries/trucksQuery';
import { getOrdersQueryOptions } from '@/features/TimeTable/queries/ordersQuery';
import {
  getDaysOfWeek,
  getFirstDayOfWeek,
  getLastDayOfWeek,
  getToday,
  getWeekNumber,
} from '@/helpers/dates';

import TimeTablePagination from '@/features/TimeTable/components/time-table-pagination';
import QueryErrorBoundary from '@/components/ui/error/query-error-boundary';
import { useTimeTableData } from '@/features/TimeTable/hooks/useTimeTableData';
import { z } from 'zod';

const TimeTable = lazy(
  () => import('@/features/TimeTable/components/time-table')
);
const TimeTableHeader = lazy(
  () => import('@/features/TimeTable/components/time-table-header')
);

const today = getToday();
const initialDate = getFirstDayOfWeek(today);

const OrderFilterSchema = z.object({
  truckId: z.coerce.number().min(1),
  startDate: z.string().default(initialDate),
});

export const Route = createFileRoute('/_layout/time-table')({
  loaderDeps: ({ search }) => ({
    truckId: search.truckId,
    startDate: search.startDate,
  }),
  loader: async ({
    context: { queryClient },
    deps: { startDate, truckId },
  }) => {
    const weekNumber = getWeekNumber(startDate);
    const firstDayOfWeek = getFirstDayOfWeek(startDate);
    const lastDayOfWeek = getLastDayOfWeek(startDate);

    await Promise.all([
      queryClient.ensureQueryData(trucksQueryOptions),
      queryClient.ensureQueryData(countriesQueryOptions),
      queryClient.ensureQueryData(
        getOrdersQueryOptions(truckId, firstDayOfWeek, lastDayOfWeek)
      ),
    ]);

    return {
      weekNumber,
      truckId,
      firstDayOfWeek,
      lastDayOfWeek,
    };
  },
  validateSearch: (search: Record<string, unknown>) =>
    OrderFilterSchema.parse(search),
  component: TimetablePage,
});

function TimetablePage() {
  const { weekNumber, lastDayOfWeek, firstDayOfWeek, truckId } = useLoaderData({
    from: '/_layout/time-table',
  });

  const { orders, trucks, countries } = useTimeTableData(
    truckId,
    firstDayOfWeek,
    lastDayOfWeek
  );

  const daysOfWeek = useMemo(
    () => getDaysOfWeek(firstDayOfWeek, lastDayOfWeek),
    [firstDayOfWeek, lastDayOfWeek]
  );

  return (
    <div className='container mx-auto py-10'>
      <QueryErrorBoundary>
        <TimeTableHeader trucks={trucks} />
        <TimeTable
          orders={orders}
          countries={countries}
          daysOfWeek={daysOfWeek}
          weekNumber={weekNumber}
        />
        <TimeTablePagination />
      </QueryErrorBoundary>
    </div>
  );
}
