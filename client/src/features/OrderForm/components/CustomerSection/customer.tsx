import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/primitives/form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/primitives/dialog';
import FormCombobox from '@/components/ui/form/form-combobox';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/primitives/input';
import CustomerForm from './customer-form';
import { Briefcase, Hash } from 'lucide-react';
import { createCustomer } from '../../mutations/customerMutation';
import { useOptimisticMutation } from '../../hooks/useOptimisticMutation';
import { useState } from 'react';
import { Customer } from '@/types/types';
import { useQuery } from '@tanstack/react-query';
import getCustomersQueryOptions from '../../queries/customersQuery';
import useDebounce from '../../hooks/useDebounce';
import PlusButton from '@/components/ui/buttons/plus-button';
import FormLabel from '@/components/ui/form/form-label';

function CustomerNameFormField({ customerID }: { customerID?: number }) {
  const { control } = useFormContext();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const debouncedSearchQuery = useDebounce(searchQuery);

  const { data, isFetching } = useQuery(
    getCustomersQueryOptions(customerID, { searchQuery: debouncedSearchQuery })
  );

  return (
    <FormField
      name='customerID'
      control={control}
      render={({ field }) => (
        <FormItem className='w-full'>
          <FormLabel Icon={Briefcase}>Zleceniodawca</FormLabel>
          <FormControl>
            <FormCombobox
              {...field}
              placeholder='Wybierz zleceniodawcę'
              data={data || []}
              onFiltersChange={setSearchQuery}
              isFetching={isFetching}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function CustomerOrderNumberFormField() {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name='orderNr'
      render={({ field }) => (
        <FormItem className='w-full'>
          <FormLabel Icon={Hash}>Numer zlecenia</FormLabel>
          <FormControl>
            <Input placeholder='000/000/000' {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default function CustomerSection({
  customerID,
}: {
  customerID?: number;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { mutate: createMutation, isPending } = useOptimisticMutation<Customer>(
    {
      mutationFn: createCustomer,
      queryKey: ['customers'],
      successMessage: 'Udało się stworzyć nowego kontrahenta.',
    }
  );

  return (
    <div className='flex justify-between gap-5'>
      <div className='w-full max-w-[50%] flex items-end gap-2'>
        <CustomerNameFormField customerID={customerID} />
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <PlusButton variant={'link'} />
          </DialogTrigger>
          <DialogContent className='max-w-screen-sm'>
            <DialogHeader>
              <DialogTitle>Dodaj nowego zleceniodawcę</DialogTitle>
              <DialogDescription>
                Wypełnij wszystkie pola aby dodać nowego zleceniodawcę.
              </DialogDescription>
            </DialogHeader>
            <CustomerForm
              mutation={createMutation}
              isPending={isPending}
              onOpenChange={setIsOpen}
            />
          </DialogContent>
        </Dialog>
      </div>
      <CustomerOrderNumberFormField />
    </div>
  );
}
