import { useMemo } from 'react';
import { Link, useSearch } from '@tanstack/react-router';
import { Truck } from '@/types/types';
import { Button } from '@/components/ui/primitives/button';

type TimeTableHeaderProps = {
  trucks: Truck[];
};

export default function TimeTableHeader({ trucks }: TimeTableHeaderProps) {
  return (
    <ul className='flex gap-2 p-2'>
      {trucks.map((truck) => (
        <TimeTableHeaderButton truck={truck} key={truck.id} />
      ))}
    </ul>
  );
}

type TimeTableHeaderButtonProps = {
  truck: Truck;
};

function TimeTableHeaderButton({ truck }: TimeTableHeaderButtonProps) {
  const { truckId: selectedTruckId, startDate } = useSearch({
    from: '/_layout/time-table',
  });

  const isSelected = truck.id === selectedTruckId;

  const search = useMemo(
    () => ({ truckId: truck.id, startDate }),
    [truck.id, startDate]
  );

  return (
    <li>
      <Button
        variant={'outline'}
        className={isSelected ? 'border-gray-950' : ''}
        asChild
      >
        <Link from='/time-table' search={search}>
          <span className='sr-only'>{truck.plate}</span>
          {truck.plate}
        </Link>
      </Button>
    </li>
  );
}
