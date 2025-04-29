import { Button } from '@/components/ui/button';
import { addWeek, getToday, subWeek } from '@/helpers/dates';
import {
  Calendar1,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

type TimeTablePaginationProps = {
  selectedWeek: string;
  onClick: (value: string) => void;
};

export default function TimeTablePagination({
  selectedWeek,
  onClick,
}: TimeTablePaginationProps) {
  return (
    <div className='flex items-start justify-end space-x-2 py-2'>
      <Button
        variant={'outline'}
        className='hidden h-8 w-8 p-0 lg:flex'
        onClick={() => onClick(subWeek(selectedWeek, 5))}
      >
        <span className='sr-only'>Wróć o 5 tygodni</span>
        <ChevronsLeft />
      </Button>
      <Button
        variant={'outline'}
        className='hidden h-8 w-8 p-0 lg:flex'
        onClick={() => onClick(subWeek(selectedWeek, 1))}
      >
        <span className='sr-only'>Wróć o 1 tydzień</span>
        <ChevronLeft />
      </Button>
      <Button
        variant={'outline'}
        className='hidden h-8 w-8 p-0 lg:flex'
        onClick={() => onClick(getToday())}
      >
        <span className='sr-only'>Idź do aktualnego tygodnia</span>
        <Calendar1 />
      </Button>
      <Button
        variant={'outline'}
        className='hidden h-8 w-8 p-0 lg:flex'
        onClick={() => onClick(addWeek(selectedWeek, 1))}
      >
        <span className='sr-only'>Idź o 1 tydzień</span>
        <ChevronRight />
      </Button>
      <Button
        variant={'outline'}
        className='hidden h-8 w-8 p-0 lg:flex'
        onClick={() => onClick(addWeek(selectedWeek, 5))}
      >
        <span className='sr-only'>Idź o 5 tygodni</span>
        <ChevronsRight />
      </Button>
    </div>
  );
}
