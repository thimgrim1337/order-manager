import { Button } from '@/components/ui/button';
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import FormMultiSelectCombobox from '@/components/ui/form/form-multiselect-combobox';
import { useSuspenseQuery } from '@tanstack/react-query';
import { PlusIcon } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import citiesQueryOptions from '../queries/citiesQuery';

export default function PlacesSection() {
  const { control } = useFormContext();
  const cities = useSuspenseQuery(citiesQueryOptions);

  return (
    <div className='flex justify-between gap-5'>
      <FormField
        control={control}
        name='loadingPlaces'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Miejsce załadunku</FormLabel>
            <FormMultiSelectCombobox
              {...field}
              placeholder='Wybierz miejsce'
              data={cities.data}
            />
            <FormMessage />
            <Button type='button'>
              <PlusIcon />
            </Button>
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name='unloadingPlaces'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Miejsce rozładunku</FormLabel>
            <FormMultiSelectCombobox
              {...field}
              placeholder='Wybierz miejsce'
              data={cities.data}
            />
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
