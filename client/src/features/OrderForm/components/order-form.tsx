import { DefaultValues, Path, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { LoaderCircle } from 'lucide-react';
import { useErrorBoundary } from 'react-error-boundary';
import { getToday, getTomorrow } from '@/helpers/dates';
import { DevTool } from '@hookform/devtools';
import CustomerSection from './CustomerSection/customer';
import DatesSection from './DateSection/dates';
import PriceSection from './PriceSection/price-section';
import TruckSection from './TruckSection/truck-section';
import PlacesSection from './PlaceSection/places';
import { getCurrencyRate } from '@/helpers/getCurrencyRate';
import { UseMutationResult } from '@tanstack/react-query';
import { City, Order, OrderWithId } from '@/types/types';

const initialValues = {
  orderNr: '',
  startDate: getToday(),
  endDate: getTomorrow(getToday()),
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

type OrderFormProps<T> = {
  values?: T;
  mutationFn: UseMutationResult<unknown, Error, T, unknown>['mutate'];
  isPending: boolean;
};

export default function OrderForm<T extends Order | OrderWithId>({
  mutationFn,
  values,
  isPending,
}: OrderFormProps<T>) {
  const { showBoundary } = useErrorBoundary();

  const form = useForm<T>({
    resolver: zodResolver(Order || OrderWithId),
    defaultValues: (values || initialValues) as DefaultValues<T>,
  });

  const onSubmit: SubmitHandler<T> = async (formValues) => {
    try {
      const order = await getCurrencyRate(formValues);

      mutationFn(order);
    } catch (error) {
      showBoundary({
        message: 'An error occured. Please again later.',
        stack: `Stack ${error}`,
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(
          onSubmit as SubmitHandler<Order>,
          (errors) => {
            console.error(errors);
          }
        )}
        className='space-y-8'
      >
        <CustomerSection />
        <DatesSection />
        <PlacesSection
          loadingPlaces={
            (form.getValues('loadingPlaces' as Path<T>) || []) as City[]
          }
          unloadingPlaces={
            (form.getValues('unloadingPlaces' as Path<T>) || []) as City[]
          }
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
