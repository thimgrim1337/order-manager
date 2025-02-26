import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';

export default function OrderDatesSection() {
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
              <Input placeholder='2025/01/01' {...field} type='date' />
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
              <Input placeholder='2025/01/01' {...field} type='date' />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
