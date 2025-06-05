import { Button } from '@/components/ui/primitives/button';
import { addWeek, getToday, subWeek } from '@/helpers/dates';
import { Link, useSearch } from '@tanstack/react-router';
import {
  Calendar1,
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
    icon: ChevronsLeft,
  },
  {
    span: 'Wróc o 1 tydzień',
    calculateDate: (date: string) => subWeek(date, 1),
    icon: ChevronLeft,
  },
  {
    span: 'Idź do aktualnego tygodnia',
    calculateDate: getToday,
    icon: Calendar1,
  },
  {
    span: 'Dalej o 1 tydzień',
    calculateDate: (date: string) => addWeek(date, 1),
    icon: ChevronRight,
  },
  {
    span: 'Dalej o 5 tygodni',
    calculateDate: (date: string) => addWeek(date, 5),
    icon: ChevronsRight,
  },
];

export default function TimeTablePagination() {
  return (
    <div className='flex items-start justify-end space-x-2 py-2'>
      {buttons.map((button) => (
        <TablePaginationButton
          key={button.span}
          span={button.span}
          icon={<button.icon />}
          calculateDate={button.calculateDate}
        />
      ))}
    </div>
  );
}

type TablePaginationButtonProps = {
  span: string;
  icon: ReactNode;
  calculateDate: (date: string) => string;
};

function TablePaginationButton({
  span,
  icon,
  calculateDate,
}: TablePaginationButtonProps) {
  const { truckId, startDate } = useSearch({ from: '/_layout/time-table' });

  const search = useMemo(
    () => ({ truckId, startDate: calculateDate(startDate) }),
    [startDate, truckId, calculateDate]
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
