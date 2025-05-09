import { Button } from '@/components/ui/primitives/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/primitives/form';
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
      <form className='grid grid-cols-3 grid-rows-2 gap-2'>
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
