import { FormControl } from '../form';
import { Button } from '../button';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../command';
import { cn } from '@/lib/utils';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Customer } from '@/types/customer';
import { forwardRef } from 'react';
import {
  FieldName,
  FieldValue,
  FieldValues,
  useFormContext,
} from 'react-hook-form';

async function fetchCustomers(): Promise<Customer[]> {
  const response = await fetch('http://localhost:3000/api/v1/customers');

  if (!response.ok) throw new Error("Can't fetch data");

  return response.json();
}

const queryOptions = {
  queryKey: ['customers'],
  queryFn: () => fetchCustomers(),
};

type FormComboboxProps<TFieldValue extends FieldValues> = {
  value: FieldValue<TFieldValue>;
  name: FieldName<TFieldValue>;
};

const FormCombobox = forwardRef<
  HTMLInputElement,
  FormComboboxProps<FieldValues>
>(({ value: fieldValue, name: fieldName }, ref) => {
  const customersQuery = useSuspenseQuery(queryOptions);
  const { data } = customersQuery;
  const { setValue } = useFormContext();

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant='outline'
              role='combobox'
              className={cn(
                'w-[200px] justify-between',
                !fieldValue && 'text-muted-foreground'
              )}
            >
              {fieldValue.name === ''
                ? 'Wybierz zleceniodawcę'
                : data.find((d) => d.name === fieldValue.name)?.name}
              <ChevronsUpDown className='opacity-50' />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className='w-[200px] p-0'>
          <Command>
            <CommandInput placeholder='Szukaj...' className='h-9' />
            <CommandList>
              <CommandEmpty>Nic nie znaleziono.</CommandEmpty>
              <CommandGroup>
                {data.map((d) => (
                  <CommandItem
                    value={d.name}
                    key={d.name}
                    ref={ref}
                    onSelect={() => {
                      setValue(fieldName, {
                        name: d.name,
                      });
                    }}
                  >
                    {d.name}
                    <Check
                      className={cn(
                        'ml-auto',
                        d.name === fieldValue.name ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
});

export default FormCombobox;
