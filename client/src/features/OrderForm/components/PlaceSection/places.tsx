import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/primitives/form';
import PlaceSelector from './place-selector';
import { useFormContext } from 'react-hook-form';
import FormLabel from '@/components/ui/form/form-label';
import { MapPin, MapPinCheckInside } from 'lucide-react';

function PlaceFormField({
  name,
}: {
  name: 'loadingPlaces' | 'unloadingPlaces';
}) {
  const { control } = useFormContext();

  const label = `Miejsca ${name === 'loadingPlaces' ? 'załadunku' : 'rozładunku'}`;
  const icon = name === 'loadingPlaces' ? MapPin : MapPinCheckInside;

  return (
    <div className='flex flex-col gap-2 w-full relative '>
      <FormField
        name={name}
        control={control}
        render={({ field }) => (
          <FormItem>
            <FormLabel Icon={icon}>{label}</FormLabel>
            <FormControl>
              <PlaceSelector {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

export default function PlacesSection() {
  return (
    <div className='flex justify-between items-end gap-5'>
      <PlaceFormField name='loadingPlaces' />
      <PlaceFormField name='unloadingPlaces' />
    </div>
  );
}
