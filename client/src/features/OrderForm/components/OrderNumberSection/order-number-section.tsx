import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';

export default function OrderNumberSection() {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name='orderNr'
      render={({ field }) => (
        <FormItem>
          <FormLabel>Nr zlecenia</FormLabel>
          <FormControl>
            <Input placeholder='000/000/000' {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
