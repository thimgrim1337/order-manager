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
} from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { today, tomorrow } from '@/helpers/dates';
import FormCombobox from '../ui/form/form-combobox';
import { DevTool } from '@hookform/devtools';

export default function OrderForm() {
  const form = useForm<Order>({
    resolver: zodResolver(Order),
    defaultValues: {
      orderNr: '',
      startDate: today,
      endDate: tomorrow,
      priceCurrency: '0',
      currency: 'PLN',
      truck: {
        plate: '',
      },
      driver: {
        firstName: '',
        lastName: '',
      },
      customer: {
        name: '',
      },
      orderLoadingPlaces: [],
      orderUnloadingPlaces: [],
    },
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
              <FormLabel>Zleceniedawca</FormLabel>
              <FormCombobox {...field} />
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
        <div className='flex justify-between'>
          <FormField
            control={form.control}
            name='startDate'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data załadunku</FormLabel>
                <FormControl>
                  <Input placeholder='2025/01/01' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='endDate'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data rozładunku</FormLabel>
                <FormControl>
                  <Input placeholder='2025/01/01' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='flex justify-between'>
          <FormField
            control={form.control}
            name='orderLoadingPlaces'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Miejsce załadunku</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Miejsce załadunku'
                    {...field}
                    value={field.value[0]?.place?.name}
                  />
                </FormControl>
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
                <FormControl>
                  <Input
                    placeholder='Miejsce rozładunku'
                    {...field}
                    value={field.value[0]?.place?.name}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='flex justify-between'>
          <FormField
            control={form.control}
            name='priceCurrency'
            render={({ field }) => (
              <FormItem>
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
              <FormItem>
                <FormLabel>Waluta</FormLabel>
                <FormControl>
                  <Input placeholder='EUR' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='flex justify-between'>
          <FormField
            control={form.control}
            name='driver'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kierowca</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Jan Kowalski'
                    {...field}
                    value={field.value.firstName}
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
              <FormItem>
                <FormLabel>Pojazd</FormLabel>
                <FormControl>
                  <Input
                    placeholder='WP0997C'
                    {...field}
                    value={field.value.plate}
                  />
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
