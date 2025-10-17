import { useNavigate, useSearch } from '@tanstack/react-router';
import { DriverWithId, TruckWithId } from '@/types/types';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/primitives/select';
import { RotateCcw, User } from 'lucide-react';
import { Button } from '@/components/ui/primitives/button';

type TimeTableHeaderProps = {
  trucks: TruckWithId[];
  drivers: DriverWithId[];
};

export default function TimeTableHeader({
  trucks,
  drivers,
}: TimeTableHeaderProps) {
  const { truckID: selectedTruckID, startDate } = useSearch({
    from: '/_layout/time-table',
  });
  const navigate = useNavigate({ from: '/time-table' });

  const assignedDriver = drivers
    .filter((driver) => driver.truckID === selectedTruckID)
    .map((driver) => `${driver.firstName} ${driver.lastName}`);

  return (
    <div className='mb-3 flex flex-col gap-2'>
      <div className='text-sm flex gap-2 items-end'>
        <User />{' '}
        {assignedDriver.length ? assignedDriver : 'Kierowca nieprzypisany'}
      </div>
      <div className='flex gap-2'>
        <Select
          defaultValue={selectedTruckID.toString()}
          value={selectedTruckID === 0 ? '' : selectedTruckID.toString()}
          onValueChange={(value) =>
            navigate({ search: { truckID: +value, startDate } })
          }
        >
          <SelectTrigger className='w-[280px]'>
            <SelectValue placeholder='Pojazd' />
          </SelectTrigger>
          <SelectContent className='max-h-[300px]'>
            {trucks.map((truck) => (
              <SelectItem value={truck.id.toString()} key={truck.id}>
                {truck.plate}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          onClick={() => navigate({ search: { truckID: 0, startDate } })}
          variant={'ghost'}
          className='flex items-center'
        >
          <RotateCcw /> Pokaż wszystkich
        </Button>
      </div>
    </div>
  );
}
