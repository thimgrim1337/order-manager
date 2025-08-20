import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/primitives/form';
import { useFormContext } from 'react-hook-form';
import { Calendar } from './calendar';

function DateFormField({ name }: { name: 'startDate' | 'endDate' }) {
  const { control } = useFormContext();

  const label = name === 'startDate' ? 'Data załadunku' : 'Data rozładunku';

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className='w-full'>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Calendar {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default function DatesSection() {
  return (
    <div className='flex justify-between  gap-5'>
      <DateFormField name='startDate' />
      <DateFormField name='endDate' />
    </div>
  );
}
