import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import FormCombobox from '@/components/ui/form/form-combobox';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useFormContext } from 'react-hook-form';
import customersQueryOptions from '../../queries/customersQuery';
import { Input } from '@/components/ui/input';

export default function CustomerSection() {
  const { control } = useFormContext();
  const customers = useSuspenseQuery(customersQueryOptions);
  return (
    <div className='flex justify-between  gap-5'>
      <FormField
        name='customerID'
        control={control}
        render={({ field }) => (
          <FormItem className='w-full'>
            <FormLabel>Zleceniodawca</FormLabel>
            <FormCombobox
              {...field}
              placeholder='Wybierz zleceniodawcę'
              data={customers.data}
            />
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name='orderNr'
        render={({ field }) => (
          <FormItem className='w-full'>
            <FormLabel>Nr zlecenia</FormLabel>
            <FormControl>
              <Input placeholder='000/000/000' {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
