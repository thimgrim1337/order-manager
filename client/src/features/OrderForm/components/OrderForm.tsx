import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { OrderCreate, OrderCreateSchema } from '../../../types/types';
import { Button } from '@/components/ui/button';
import { LoaderCircle } from 'lucide-react';
import { useErrorBoundary } from 'react-error-boundary';
import { today, tomorrow } from '@/helpers/dates';
import { DevTool } from '@hookform/devtools';
import CustomerSection from './CustomerSection/CustomerSection';
import DatesSection from './DateSection/DatesSection';
import PriceSection from './PriceSection/price-section';
import TruckSection from './TruckSection/truck-section';
import PlacesSection from './PlaceSection/PlacesSection';
import { getCurrencyRate } from '@/helpers/getCurrencyRate';
import { UseMutationResult } from '@tanstack/react-query';

const defaultValues = {
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
};

type OrderFormProps = {
  values?: OrderCreate;
  mutationFn: UseMutationResult<unknown, Error, OrderCreate, unknown>['mutate'];
  isPending: boolean;
};

export default function OrderForm({
  mutationFn,
  values,
  isPending,
}: OrderFormProps) {
  const { showBoundary } = useErrorBoundary();

  const form = useForm<OrderCreate>({
    resolver: zodResolver(OrderCreateSchema),
    defaultValues: values || defaultValues,
  });

  async function onSubmit(formValues: OrderCreate) {
    try {
      const order = await getCurrencyRate(formValues);

      mutationFn(order);
    } catch (error) {
      showBoundary({
        message: 'An error occured. Please again later.',
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
        <CustomerSection />
        <DatesSection />
        <PlacesSection
          selectedLoadingPlaces={form.getValues('loadingPlaces')}
          selectedUnloadingPlaces={form.getValues('unloadingPlaces')}
        />
        <PriceSection />
        <TruckSection />
        <Button type='submit'>
          {values ? 'Edytuj' : 'Dodaj'}
          {isPending && <LoaderCircle className='animate-spin' />}
        </Button>
        <DevTool control={form.control} /> {/* set up the dev tool */}
      </form>
    </Form>
  );
}
