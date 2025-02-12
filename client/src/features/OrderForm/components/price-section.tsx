import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useFormContext } from 'react-hook-form';

const currencies = ['PLN', 'EUR'];

export default function PriceSection() {
  const { control } = useFormContext();

  return (
    <div className='flex justify-between  gap-5'>
      <FormField
        control={control}
        name='priceCurrency'
        render={({ field }) => (
          <FormItem className='w-full'>
            <FormLabel>Cena w walucie</FormLabel>
            <FormControl>
              <Input placeholder='5000' {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name='currency'
        render={({ field }) => (
          <FormItem className='w-full'>
            <FormLabel>Waluta</FormLabel>
            <Select {...field}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={'PLN'} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {currencies.map((d) => (
                  <SelectItem value={d} key={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
