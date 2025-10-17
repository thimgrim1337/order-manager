import {
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/primitives/form';
import FormCombobox from '@/components/ui/form/form-combobox';
import { useSuspenseQueries } from '@tanstack/react-query';
import { useFormContext } from 'react-hook-form';
import driversQueryOptions from '../../queries/driversQuery';
import trucksQueryOptions from '../../queries/trucksQuery';
import FormLabel from '@/components/ui/form/form-label';
import { Truck, User } from 'lucide-react';

export default function TruckSection() {
  const { control, setValue } = useFormContext();
  const [drivers, trucks] = useSuspenseQueries({
    queries: [driversQueryOptions, trucksQueryOptions],
  });

  const handleDriverChange = (id: string | number) => {
    const driver = drivers.data.find((driver) => driver.id === id);

    if (driver?.truckID) setValue('truckID', driver.truckID);

    setValue('driverID', id);
  };

  return (
    <div className='flex justify-between  gap-5'>
      <FormField
        control={control}
        name='driverID'
        render={({ field }) => (
          <FormItem className='w-full'>
            <FormLabel Icon={User}>Kierowca</FormLabel>
            <FormCombobox
              {...field}
              onChange={handleDriverChange}
              data={drivers.data.map((driver) => {
                return {
                  id: driver.id,
                  name: `${driver.firstName} ${driver.lastName}`,
                };
              })}
              placeholder='Wybierz kierowcę'
            />
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name='truckID'
        render={({ field }) => (
          <FormItem className='w-full'>
            <FormLabel Icon={Truck}>Pojazd</FormLabel>
            <FormCombobox
              {...field}
              placeholder='Wybierz pojazd'
              data={trucks.data.map((truck) => {
                return {
                  id: truck.id,
                  name: truck.plate,
                };
              })}
            />
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
