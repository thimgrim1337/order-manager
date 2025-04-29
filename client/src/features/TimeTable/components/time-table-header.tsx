import { Button } from '@/components/ui/button';
import { Truck } from '@/types/types';
import { MouseEvent } from 'react';

type TimeTableHeaderProps = {
  trucks: Truck[];
  selectedTruck: number;
  onSelectTruck: (e: MouseEvent<HTMLUListElement>) => void;
};

export default function TimeTableHeader({
  trucks,
  onSelectTruck,
  selectedTruck,
}: TimeTableHeaderProps) {
  return (
    <ul className='flex gap-2 p-2' onClick={onSelectTruck}>
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
  );
}
