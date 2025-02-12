import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import FormCombobox from '@/components/ui/form/form-combobox';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useFormContext } from 'react-hook-form';
import customersQueryOptions from '../queries/customersQuery';

export default function CustomerSection() {
  const { control } = useFormContext();
  const customers = useSuspenseQuery(customersQueryOptions);
  return (
    <FormField
      name='customerID'
      control={control}
      render={({ field }) => (
        <FormItem>
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
  );
}
