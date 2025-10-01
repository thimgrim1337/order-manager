import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/primitives/form';
import { useFormContext } from 'react-hook-form';
import { Calendar } from './calendar';
import { CalendarArrowDown, CalendarArrowUp } from 'lucide-react';
import FormLabel from '@/components/ui/form/form-label';

function DateFormField({ name }: { name: 'startDate' | 'endDate' }) {
  const { control } = useFormContext();

  const label = name === 'startDate' ? 'Data załadunku' : 'Data rozładunku';
  const icon = name === 'startDate' ? CalendarArrowDown : CalendarArrowUp;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className='w-full'>
          <FormLabel Icon={icon}>{label}</FormLabel>
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
