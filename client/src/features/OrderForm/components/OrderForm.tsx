import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { OrderCreate, OrderCreateSchema } from '../../../types/types';
import { Button } from '@/components/ui/button';
import { LoaderCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useErrorBoundary } from 'react-error-boundary';
import { today, tomorrow, yesterday } from '@/helpers/dates';
import { DevTool } from '@hookform/devtools';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createOrder } from '../mutations/orderMutation';
import { fetchCurrencyRate } from '../queries/currencyRateQuery';
import CustomerSection from './CustomerSection/CustomerSection';
import NumberSection from './NumberSection/NumberSection';
import DatesSection from './DateSection/DatesSection';
import PriceSection from './PriceSection/price-section';
import TruckSection from './TruckSection/truck-section';
import PlacesSection from './PlaceSection/PlacesSection';
import { Dispatch, SetStateAction } from 'react';

type OrderFormProps = {
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  values?: OrderCreate;
};

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

export default function OrderForm({
  onOpenChange: setIsOpen,
  values,
}: OrderFormProps) {
  const { showBoundary } = useErrorBoundary();

  const form = useForm<OrderCreate>({
    resolver: zodResolver(OrderCreateSchema),
    defaultValues: values || defaultValues,
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
          'c',
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
        <CustomerSection />
        <NumberSection />
        <DatesSection />
        <PlacesSection
          selectedLoadingPlaces={form.getValues('loadingPlaces')}
          selectedUnloadingPlaces={form.getValues('unloadingPlaces')}
        />
        <PriceSection />
        <TruckSection />
        <Button type='submit'>
          Dodaj
          {mutation.isPending && <LoaderCircle className='animate-spin' />}
        </Button>
        <DevTool control={form.control} /> {/* set up the dev tool */}
      </form>
    </Form>
  );
}
