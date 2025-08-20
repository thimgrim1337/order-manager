import { useForm } from 'react-hook-form';
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
import { Dispatch, SetStateAction, Suspense } from 'react';
import { customResolver } from '@/lib/customResolver';

const today = getToday();
const tomorrow = getTomorrow(today);

const initialValues: Order = {
  orderNr: '',
  startDate: formatDate(today),
  endDate: formatDate(tomorrow),
  statusID: 1,
  priceCurrency: '',
  pricePLN: '',
  currencyRate: '0',
  currency: 'PLN',
  truckID: 0,
  driverID: 0,
  customerID: 0,
  loadingPlaces: [],
  unloadingPlaces: [],
};

type OrderFormProps = {
  values: Order;
  mutation: UseMutationResult<unknown, Error, Order, unknown>['mutate'];
  isPending: boolean;
  onOpenChange?: Dispatch<SetStateAction<boolean>>;
};

export default function OrderForm({
  mutation,
  isPending,
  onOpenChange,
  values,
}: OrderFormProps) {
  const { showBoundary } = useErrorBoundary();

  const form = useForm({
    resolver: customResolver(Order),
    defaultValues: values || initialValues,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  });

  const handleSubmit = async (formValues: Order) => {
    try {
      const order = { ...formValues };

      order.pricePLN =
        order.currency !== 'PLN'
          ? String(
              parseFloat(order.priceCurrency) * parseFloat(order.currencyRate)
            )
          : order.priceCurrency;

      mutation(order, {
        onSuccess: () => onOpenChange && onOpenChange(false),
      });
    } catch (error) {
      showBoundary({
        message: 'An error occured. Please try again later.',
        stack: `Stack ${error}`,
      });
    }
  };

  const label = values ? 'Edytuj zlecenie' : 'Dodaj zlecenie';

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit, (errors) => {
          console.error(errors);
        })}
        className='space-y-8'
      >
        <Suspense fallback={<p>Loading....</p>}>
          <CustomerSection customerID={values?.customerID} />
          <DatesSection />
          <PlacesSection />
          <PriceSection />
          <TruckSection />
        </Suspense>
        <Button type='submit' aria-label={label}>
          {label}
          {isPending && <LoaderCircle className='animate-spin' />}
        </Button>
        <DevTool control={form.control} />
      </form>
    </Form>
  );
}
