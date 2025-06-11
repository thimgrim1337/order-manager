import { DefaultValues, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/primitives/form';
import { Button } from '@/components/ui/primitives/button';
import { LoaderCircle } from 'lucide-react';
import { useErrorBoundary } from 'react-error-boundary';
import { formatDate, getToday, getTomorrow } from '@/helpers/dates';
import { DevTool } from '@hookform/devtools';
import CustomerSection from './CustomerSection/customer';
import DatesSection from './DateSection/dates';
import PriceSection from './PriceSection/price-section';
import TruckSection from './TruckSection/truck-section';
import PlacesSection from './PlaceSection/places';
import { UseMutationResult } from '@tanstack/react-query';
import { Order } from '@/types/types';

const today = getToday();
const tomorrow = getTomorrow(today);

const initialValues = {
  orderNr: '',
  startDate: formatDate(today),
  endDate: formatDate(tomorrow),
  statusId: 1,
  priceCurrency: '',
  pricePLN: '',
  currencyRate: '0',
  currency: 'PLN',
  truckId: undefined,
  driverId: undefined,
  customerId: undefined,
  loadingPlaces: [],
  unloadingPlaces: [],
};

type OrderFormProps<T> = {
  values?: T;
  mutation: UseMutationResult<unknown, Error, T, unknown>;
  isPending: boolean;
};

export default function OrderForm<T extends Order>({
  mutation,
  values,
  isPending,
}: OrderFormProps<T>) {
  const { showBoundary } = useErrorBoundary();

  const form = useForm<T>({
    resolver: zodResolver(Order),
    defaultValues: (values || initialValues) as DefaultValues<T>,
  });

  const handleSubmit: SubmitHandler<T> = async (formValues) => {
    try {
      const order = { ...formValues };

      order.pricePLN =
        order.currency !== 'PLN'
          ? String(
              parseFloat(order.priceCurrency) * parseFloat(order.currencyRate)
            )
          : order.priceCurrency;

      mutation.mutate(order);
    } catch (error) {
      showBoundary({
        message: 'An error occured. Please try again later.',
        stack: `Stack ${error}`,
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit, (errors) => {
          console.error(errors);
        })}
        className='space-y-8'
      >
        <CustomerSection />
        <DatesSection />
        <PlacesSection />
        <PriceSection />
        <TruckSection />
        <Button
          type='submit'
          aria-label={values ? 'Edytuj zlecenie' : 'Dodaj zlecenie'}
        >
          {values ? 'Edytuj' : 'Dodaj'}
          {isPending && <LoaderCircle className='animate-spin' />}
        </Button>
        <DevTool control={form.control} />
      </form>
    </Form>
  );
}
