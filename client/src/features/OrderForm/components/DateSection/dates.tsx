import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/primitives/form';
import { useFormContext } from 'react-hook-form';
import { Calendar } from './calendar';

export default function DatesSection() {
  const { control } = useFormContext();
  return (
    <div className='flex justify-between  gap-5'>
      <FormField
        control={control}
        name='startDate'
        render={({ field }) => (
          <FormItem className='w-full'>
            <FormLabel>Data załadunku</FormLabel>
            <FormControl>
              <Calendar {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name='endDate'
        render={({ field }) => (
          <FormItem className='w-full'>
            <FormLabel>Data rozładunku</FormLabel>
            <FormControl>
              <Calendar {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
