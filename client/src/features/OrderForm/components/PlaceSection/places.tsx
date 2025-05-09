import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/primitives/form';
import PlaceControl from './place-control';
import { useFormContext } from 'react-hook-form';

export default function PlacesSection() {
  const { control } = useFormContext();

  return (
    <div className='flex justify-between items-end gap-5'>
      <div className='flex flex-col gap-2 w-full'>
        <FormField
          name='loadingPlaces'
          control={control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <PlaceControl {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className='flex flex-col gap-2 w-full'>
        <FormField
          name='unloadingPlaces'
          control={control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <PlaceControl {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
