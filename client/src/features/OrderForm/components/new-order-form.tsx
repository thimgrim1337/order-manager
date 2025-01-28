import { Order } from '@/types/order';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { today, tomorrow } from '@/helpers/dates';
import { DevTool } from '@hookform/devtools';
import FormCombobox from '@/components/ui/form/form-combobox';
import { useSuspenseQueries } from '@tanstack/react-query';
import customersQueryOptions from '../queries/customersQuery';
import placesQueryOptions from '../queries/placesQuery';
import FormMultiSelectCombobox from '@/components/ui/form/form-multiselect-combobox';
import driversQueryOptions from '../queries/driversQuery';
import FormSelect from '@/components/ui/form/form-select';

const currencies = ['PLN', 'EUR'];

export default function OrderForm() {
  const form = useForm<Order>({
    resolver: zodResolver(Order),
    defaultValues: {
      orderNr: '',
      startDate: today,
      endDate: tomorrow,
      priceCurrency: '0',
      currency: 'PLN',
      truck: undefined,
      driver: undefined,
      customer: undefined,
      orderLoadingPlaces: [],
      orderUnloadingPlaces: [],
    },
  });
  const [customers, places, drivers] = useSuspenseQueries({
    queries: [customersQueryOptions, placesQueryOptions, driversQueryOptions],
  });

  function onSubmit(values: Order) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <FormField
          name='customer'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Zleceniodawca</FormLabel>
              <FormCombobox
                {...field}
                placeholder='Wybierz zleceniodawcę'
                data={customers.data}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
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
        <div className='flex justify-between  gap-5'>
          <FormField
            control={form.control}
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
            control={form.control}
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
        <div className='flex justify-between gap-5'>
          <FormField
            control={form.control}
            name='orderLoadingPlaces'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Miejsce załadunku</FormLabel>
                <FormMultiSelectCombobox
                  {...field}
                  placeholder='Wybierz miejsce'
                  data={places.data}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='orderUnloadingPlaces'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Miejsce rozładunku</FormLabel>
                <FormMultiSelectCombobox
                  {...field}
                  placeholder='Wybierz miejsce'
                  data={places.data}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='flex justify-between  gap-5'>
          <FormField
            control={form.control}
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
            control={form.control}
            name='currency'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Waluta</FormLabel>
                <FormControl>
                  <FormSelect
                    {...field}
                    data={currencies}
                    placeholder='Wybierz walutę'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='flex justify-between  gap-5'>
          <FormField
            control={form.control}
            name='driver'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Kierowca</FormLabel>
                <FormControl>
                  <FormCombobox
                    {...field}
                    data={drivers.data.map((driver) => {
                      return {
                        id: driver.id,
                        name: `${driver.firstName} ${driver.lastName}`,
                      };
                    })}
                    placeholder='Wybierz kierowcę'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='truck'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Pojazd</FormLabel>
                <FormControl>
                  <Input placeholder='WP0997C' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type='submit'>Dodaj</Button>
      </form>
      <DevTool control={form.control} /> {/* set up the dev tool */}
    </Form>
  );
}
