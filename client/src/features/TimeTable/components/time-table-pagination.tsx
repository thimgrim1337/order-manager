import { Button } from '@/components/ui/primitives/button';
import { addWeek, formatDate, getToday, subWeek } from '@/helpers/dates';
import { Link, useLoaderData, useSearch } from '@tanstack/react-router';
import {
  Calendar1,
  CalendarSync,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { ReactNode, useMemo } from 'react';

const buttons = [
  {
    span: 'Wróc o 5 tygodni',
    calculateDate: (date: string) => subWeek(date, 5),
    Icon: ChevronsLeft,
  },
  {
    span: 'Wróc o 1 tydzień',
    calculateDate: (date: string) => subWeek(date, 1),
    Icon: ChevronLeft,
  },
  {
    span: 'Idź do akutanlne tygodnia',
    calculateDate: getToday,
    Icon: CalendarSync,
  },
  {
    span: 'Dalej o 1 tydzień',
    calculateDate: (date: string) => addWeek(date, 1),
    Icon: ChevronRight,
  },
  {
    span: 'Dalej o 5 tygodni',
    calculateDate: (date: string) => addWeek(date, 5),
    Icon: ChevronsRight,
  },
];

export default function TimeTablePagination() {
  const { firstDay, lastDay, weekNumber } = useLoaderData({
    from: '/_layout/time-table',
  });
  const monday = formatDate(firstDay);
  const sunday = formatDate(lastDay);

  return (
    <div className='flex items-start justify-end space-x-2 py-2'>
      {buttons.map((button) => (
        <TablePaginationButton
          icon={<button.Icon />}
          span={button.span}
          calculateDate={button.calculateDate}
          key={button.span}
        />
      ))}
      <Button variant={'outline'} className='hidden h-8 px-2 lg:flex'>
        {weekNumber}
      </Button>
      <Button variant={'outline'} className='hidden h-8 px-2 lg:flex'>
        <Calendar1 />
        {monday} - {sunday}
      </Button>
    </div>
  );
}

type TablePaginationButtonProps = {
  span: string;
  icon: ReactNode;
  calculateDate: (date: string) => Date;
};

function TablePaginationButton({
  span,
  icon,
  calculateDate,
}: TablePaginationButtonProps) {
  const { truckID, startDate } = useSearch({ from: '/_layout/time-table' });

  const search = useMemo(
    () => ({ truckID, startDate: formatDate(calculateDate(startDate)) }),
    [startDate, truckID, calculateDate]
  );

  return (
    <Button variant={'outline'} className='hidden h-8 w-8 p-0 lg:flex' asChild>
      <Link from='/time-table' search={search}>
        <span className='sr-only'>{span}</span>
        {icon}
      </Link>
    </Button>
  );
}
