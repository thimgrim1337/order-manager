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
import { today, tomorrow, yesterday } from '@/helpers/dates';
import { DevTool } from '@hookform/devtools';
import FormCombobox from '@/components/ui/form/form-combobox';
import {
  useMutation,
  useQueryClient,
  useSuspenseQueries,
} from '@tanstack/react-query';
import customersQueryOptions from '../queries/customersQuery';
import citiesQueryOptions from '../queries/citiesQuery';
import FormMultiSelectCombobox from '@/components/ui/form/form-multiselect-combobox';
import driversQueryOptions from '../queries/driversQuery';
import FormSelect from '@/components/ui/form/form-select';
import trucksQueryOptions from '../queries/trucksQuery';
import { createOrder } from '../mutations/orderMutation';
import { fetchCurrencyRate } from '../queries/currencyRateQuery';
import { useErrorBoundary } from 'react-error-boundary';
import { LoaderCircle, PlusIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { OrderCreate, OrderCreateSchema } from '../../../types/types';

const currencies = ['PLN', 'EUR'];

type OrderFormProps = {
  setIsOpen: (open: boolean) => void;
};

export default function OrderForm({ setIsOpen }: OrderFormProps) {
  const { showBoundary } = useErrorBoundary();

  const form = useForm<OrderCreate>({
    resolver: zodResolver(OrderCreateSchema),
    defaultValues: {
      orderNr: '',
      startDate: today,
      endDate: tomorrow,
      statusID: 1,
      priceCurrency: '',
      pricePLN: '',
      currencyRate: '0',
      currency: 'PLN',
      truckID: undefined,
      driverID: undefined,
      customerID: undefined,
      loadingPlaces: [],
      unloadingPlaces: [],
    },
  });

  const [customers, cities, drivers, trucks] = useSuspenseQueries({
    queries: [
      customersQueryOptions,
      citiesQueryOptions,
      driversQueryOptions,
      trucksQueryOptions,
    ],
  });

  const { toast } = useToast();

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: createOrder,
    onMutate: async (newOrder) => {
      await queryClient.cancelQueries({ queryKey: ['orders'] });

      const previousOrders = queryClient.getQueryData(['orders']);

      if (previousOrders)
        queryClient.setQueryData(['orders'], { ...previousOrders, newOrder });

      return { previousOrders };
    },
    onError: (err, newOrder, context) => {
      if (context?.previousOrders) {
        queryClient.setQueryData(['orders'], context.previousOrders);
      }
      toast({
        title: 'Błąd',
        description: 'Nie udało się dodać nowego zlecenia.',
        variant: 'destructive',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      setIsOpen(false);
    },
    onSuccess: () => {
      toast({
        title: 'Nowe zlecenie',
        description: 'Dodano nowe zlecenie',
      });
    },
  });

  async function onSubmit(values: OrderCreate) {
    try {
      const formData = { ...values };

      if (formData.currency !== 'EUR')
        formData.pricePLN = formData.priceCurrency;
      else {
        const response = await fetchCurrencyRate(
          'a',
          'eur',
          yesterday(formData.endDate)
        );

        const currencyRate = response.rates[0].mid;
        const pricePLN = parseFloat(formData.priceCurrency) * currencyRate;

        formData.currencyRate = String(currencyRate);
        formData.pricePLN = String(pricePLN);
      }

      mutation.mutate(formData);
    } catch (error) {
      showBoundary({
        message: "Can't fetch currency rate from API. Please again later.",
        stack: `Stack ${error}`,
      });
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, (errors) => {
          console.error(errors);
        })}
        className='space-y-8'
      >
        <FormField
          name='customerID'
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
            name='loadingPlaces'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Miejsce załadunku</FormLabel>
                <FormMultiSelectCombobox
                  {...field}
                  placeholder='Wybierz miejsce'
                  data={cities.data}
                />
                <FormMessage />
                <Button type='button'>
                  <PlusIcon />
                </Button>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='unloadingPlaces'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Miejsce rozładunku</FormLabel>
                <FormMultiSelectCombobox
                  {...field}
                  placeholder='Wybierz miejsce'
                  data={cities.data}
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
            name='driverID'
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
            name='truckID'
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

        <Button type='submit'>
          Dodaj
          {mutation.isPending && <LoaderCircle className='animate-spin' />}
        </Button>
      </form>
      <DevTool control={form.control} /> {/* set up the dev tool */}
    </Form>
  );
}
