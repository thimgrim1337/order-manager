import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/primitives/form';
import PlaceSelector from './place-selector';
import { useFormContext } from 'react-hook-form';

function PlaceFormField({
  name,
}: {
  name: 'loadingPlaces' | 'unloadingPlaces';
}) {
  const { control } = useFormContext();

  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <PlaceSelector {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default function PlacesSection() {
  return (
    <div className='flex justify-between items-end gap-5'>
      <div className='flex flex-col gap-2 w-full'>
        <PlaceFormField name='loadingPlaces' />
      </div>

      <div className='flex flex-col gap-2 w-full'>
        <PlaceFormField name='unloadingPlaces' />
      </div>
    </div>
  );
}
