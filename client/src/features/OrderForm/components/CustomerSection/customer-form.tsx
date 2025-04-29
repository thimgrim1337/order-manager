import { Button } from '@/components/ui/primitives/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/primitives/form';
import FormCountrySelect from '@/components/ui/form/form-country-select';
import { Input } from '@/components/ui/primitives/input';
import { Customer } from '@/types/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { BriefcaseBusinessIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useErrorBoundary } from 'react-error-boundary';
import { UseMutationResult } from '@tanstack/react-query';

const initialValues: Customer = {
  name: '',
  tax: '',
  address: {
    street: '',
    streetNr: '',
    postal: '',
    city: '',
    countryID: 39,
  },
};

type CustomerFormProps = {
  mutationFn: UseMutationResult<unknown, Error, Customer, unknown>['mutate'];
};

export default function CustomerForm({ mutationFn }: CustomerFormProps) {
  const { showBoundary } = useErrorBoundary();

  const form = useForm<Customer>({
    resolver: zodResolver(Customer),
    defaultValues: initialValues,
  });

  async function submitHandle(formData: Customer) {
    try {
      mutationFn(formData);
    } catch (error) {
      showBoundary({
        message: 'An error occured. Please again later.',
        stack: `Stack ${error}`,
      });
    }
  }

  return (
    <Form {...form}>
      <form className='grid grid-cols-4 grid-rows-5 gap-2'>
        <BriefcaseBusinessIcon
          size={'64px'}
          className='row-span-2 place-self-center'
        />

        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem className='col-start-2 -col-end-1'>
              <FormLabel>Nazwa</FormLabel>
              <FormControl>
                <Input placeholder='Nazwa sp z o.o.' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='tax'
          render={({ field }) => (
            <FormItem className='col-start-2 -col-end-1'>
              <FormLabel>NIP</FormLabel>
              <FormControl>
                <Input placeholder='PL1234567890' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='address.street'
          render={({ field }) => (
            <FormItem className='col-start-1 col-end-4'>
              <FormLabel>Ulica</FormLabel>
              <FormControl>
                <Input placeholder='Polna' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='address.streetNr'
          render={({ field }) => (
            <FormItem className='col-start-4 -col-end-1'>
              <FormLabel>Nr ulicy</FormLabel>
              <FormControl>
                <Input placeholder='1/2' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='address.countryID'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kraj</FormLabel>
              <FormControl>
                <FormCountrySelect {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='address.postal'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kod pocztowy</FormLabel>
              <FormControl>
                <Input placeholder='09-400' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='address.city'
          render={({ field }) => (
            <FormItem className='col-start-3 -col-end-1'>
              <FormLabel>Miejscowość</FormLabel>
              <FormControl>
                <Input placeholder='Płock' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type='button'
          className='row-start-5 col-start-1 -col-end-1 self-center'
          onClick={form.handleSubmit(submitHandle)}
        >
          Zapisz
        </Button>
      </form>
    </Form>
  );
}
