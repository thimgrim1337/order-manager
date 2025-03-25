import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { OrderCreate, OrderCreateSchema } from '../../../types/types';
import { Button } from '@/components/ui/button';
import { LoaderCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useErrorBoundary } from 'react-error-boundary';
import { today, tomorrow } from '@/helpers/dates';
import { DevTool } from '@hookform/devtools';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createOrder, updateOrder } from '../mutations/orderMutation';
import CustomerSection from './CustomerSection/CustomerSection';
import NumberSection from './NumberSection/NumberSection';
import DatesSection from './DateSection/DatesSection';
import PriceSection from './PriceSection/price-section';
import TruckSection from './TruckSection/truck-section';
import PlacesSection from './PlaceSection/PlacesSection';
import { Dispatch, SetStateAction } from 'react';
import { getCurrencyRate } from '@/helpers/getCurrencyRate';

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
  const createMutation = useMutation({
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
        console.log(err);
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

  const updateMutation = useMutation({
    mutationFn: updateOrder,
    onMutate: async (newOrder) => {
      await queryClient.cancelQueries({ queryKey: ['orders', newOrder.id] });

      const previousOrders = queryClient.getQueryData(['orders', newOrder.id]);

      queryClient.setQueryData(['orders', newOrder.id], newOrder);

      return { previousOrders, newOrder };
    },
    onError: (err, newOrder, context) => {
      queryClient.setQueryData(
        ['orders', context?.newOrder.id],
        context?.previousOrders
      );
      toast({
        title: 'Błąd',
        description: 'Nie udało się edytować zlecenia.',
        variant: 'destructive',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      setIsOpen(false);
    },
    onSuccess: (newOrder) => {
      toast({
        title: 'Edycja zlecenia',
        description: `Edytowane zlecenie nr ${newOrder.orderNr}`,
      });
    },
  });

  async function onSubmit(formValues: OrderCreate) {
    try {
      const order = await getCurrencyRate(formValues);

      if (order.id) return updateMutation.mutate(order);

      return createMutation.mutate(order);
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
          {values ? 'Edytuj' : 'Dodaj'}
          {createMutation.isPending && (
            <LoaderCircle className='animate-spin' />
          )}
        </Button>
        <DevTool control={form.control} /> {/* set up the dev tool */}
      </form>
    </Form>
  );
}
