import { Order } from '@/types/order';
import { FieldErrors, useForm } from 'react-hook-form';
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
import trucksQueryOptions from '../queries/trucksQuery';

const currencies = ['PLN', 'EUR'];

export default function OrderForm() {
  const form = useForm<Order>({
    resolver: zodResolver(Order),
    defaultValues: {
      orderNr: '',
      startDate: today,
      endDate: tomorrow,
      status: 'W trakcie',
      priceCurrency: 0,
      pricePLN: 0,
      currencyRate: 4.2254,
      currency: 'PLN',
      truck: undefined,
      driver: undefined,
      customer: undefined,
      orderLoadingPlaces: [],
      orderUnloadingPlaces: [],
    },
  });

  const [customers, places, drivers, trucks] = useSuspenseQueries({
    queries: [
      customersQueryOptions,
      placesQueryOptions,
      driversQueryOptions,
      trucksQueryOptions,
    ],
  });

  function onIvalid(error: FieldErrors) {
    console.error(error);
  }

  function onSubmit(values: Order) {
    const formData = { ...values };

    if (formData.currency === 'PLN') formData.pricePLN = formData.priceCurrency;
    else formData.pricePLN = formData.priceCurrency * formData.currencyRate;

    console.log(formData);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onIvalid)}
        className='space-y-8'
      >
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
                <FormCombobox
                  {...field}
                  placeholder='Wybierz pojazd.'
                  data={trucks.data.map((truck) => {
                    return {
                      id: truck.id,
                      name: truck.plate,
                    };
                  })}
                />
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
