import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import FormCombobox from '@/components/ui/form/form-combobox';
import { useSuspenseQueries } from '@tanstack/react-query';
import { useFormContext } from 'react-hook-form';
import driversQueryOptions from '../../queries/driversQuery';
import trucksQueryOptions from '../../queries/trucksQuery';

export default function TruckSection() {
  const { control } = useFormContext();
  const [drivers, trucks] = useSuspenseQueries({
    queries: [driversQueryOptions, trucksQueryOptions],
  });

  return (
    <div className='flex justify-between  gap-5'>
      <FormField
        control={control}
        name='driverID'
        render={({ field }) => (
          <FormItem className='w-full'>
            <FormLabel>Kierowca</FormLabel>
            <FormCombobox
              {...field}
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
            <FormLabel>Pojazd</FormLabel>
            <FormCombobox
              {...field}
              placeholder='Wybierz pojazd.'
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
