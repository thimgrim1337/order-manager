import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/primitives/form';
import { Input } from '@/components/ui/primitives/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/primitives/select';
import { useFormContext, useWatch } from 'react-hook-form';
import { Currencies, Order } from '@/types/types';
import { LoaderCircle } from 'lucide-react';
import useCurrencyRate from '../../hooks/useCurrencyRate';

const currencies: Currencies[] = ['PLN', 'EUR'];

export default function PriceSection() {
  const { control } = useFormContext<Order>();
  const endDate = useWatch({ name: 'endDate' });
  const currency: Currencies = useWatch({ name: 'currency' });
  const { isLoading, isError, error } = useCurrencyRate({
    currency: currency,
    date: endDate,
  });

  return (
    <div className='flex justify-between  gap-5'>
      <FormField
        control={control}
        name='priceCurrency'
        render={({ field }) => (
          <FormItem className='w-full'>
            <FormLabel>Cena w walucie</FormLabel>
            <FormControl>
              <Input placeholder='5000' type='number' {...field} />
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

            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger aria-label='Currency Selector'>
                  <SelectValue placeholder='Select currency' />
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
            {isLoading && <LoaderCircle className='animate-spin' />}
            {isError && (
              <p className='text-[0.8rem] font-medium text-destructive'>
                {error?.message}
              </p>
            )}

            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
