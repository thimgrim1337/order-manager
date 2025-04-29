import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/primitives/form';
import FormCombobox from '@/components/ui/form/form-combobox';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/primitives/input';
import CustomerForm from './customer-form';
import Dialog from '@/components/ui/dialog/dialog';
import { Button } from '@/components/ui/primitives/button';
import { PlusIcon } from 'lucide-react';
import { createCustomer } from '../../mutations/customerMutation';
import { useCreateMutation } from '../../hooks/useCreateMutation';
import { useState } from 'react';
import { Customer } from '@/types/types';
import { useSuspenseQuery } from '@tanstack/react-query';
import customersQueryOptions from '../../queries/customersQuery';
import DropdownMenu, {
  DropdownMenuItem,
} from '@/components/ui/dropdown/dropdown';

export default function CustomerSection() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { control } = useFormContext();

  const { data: customers } = useSuspenseQuery(customersQueryOptions);

  const { createMutation } = useCreateMutation<Customer>({
    mutationFn: createCustomer,
    queryKey: ['customers'],
    toastDescription: 'Udało się stworzyć nowego kontrahenta.',
    toastTitle: 'Nowy kontrahent',
    errorDescription: 'Nie udało się utworzyć kontrahenta.',
    onOpenDialogChange: setIsOpen,
  });

  const dropwdownItems: DropdownMenuItem[] = [
    {
      label: 'Pobierz dane z GUS',
      onClick: setIsOpen,
    },
    {
      label: 'Wprowadź dane ręcznie',
      onClick: setIsOpen,
    },
  ];

  return (
    <div className='flex justify-between gap-5'>
      <div className='w-full'>
        <FormField
          name='customerID'
          control={control}
          render={({ field }) => (
            <FormItem className='w-full pb-2'>
              <FormLabel>Zleceniodawca</FormLabel>
              <FormControl>
                <FormCombobox
                  {...field}
                  placeholder='Wybierz zleceniodawcę'
                  data={customers}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <DropdownMenu
          title='Dodawanie nowego kontrahenta'
          trigger={
            <Button size={'sm'}>
              <PlusIcon />
            </Button>
          }
          items={dropwdownItems}
        />

        <Dialog
          title='Dodaj nowego kontrahenta'
          description='Wypełnij pola aby dodać nowego kontrahenta.'
          isOpen={isOpen}
          onOpenChange={setIsOpen}
        >
          <CustomerForm mutationFn={createMutation.mutate} />
        </Dialog>
      </div>

      <FormField
        control={control}
        name='orderNr'
        render={({ field }) => (
          <FormItem className='w-full'>
            <FormLabel>Nr zlecenia</FormLabel>
            <FormControl>
              <Input placeholder='000/000/000' {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
