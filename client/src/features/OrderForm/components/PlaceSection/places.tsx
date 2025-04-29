import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/primitives/form';
import { City } from '@/types/types';

import { useFormContext } from 'react-hook-form';
import PlaceControl from './place-control';

type PlaceSectionProps = {
  loadingPlaces: City[];
  unloadingPlaces: City[];
};

export default function PlacesSection({
  loadingPlaces,
  unloadingPlaces,
}: PlaceSectionProps) {
  const { control } = useFormContext();

  return (
    <div className='flex justify-between items-end gap-5'>
      <div className='flex flex-col gap-2 w-full'>
        <FormField
          control={control}
          name='loadingPlaces'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <PlaceControl {...field} selectedPlaces={loadingPlaces} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className='flex flex-col gap-2 w-full'>
        <FormField
          control={control}
          name='unloadingPlaces'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <PlaceControl {...field} selectedPlaces={unloadingPlaces} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
