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
import { forwardRef } from 'react';
import {
  FieldName,
  FieldValue,
  FieldValues,
  useFormContext,
} from 'react-hook-form';

type FormComboboxProps<TFieldValue extends FieldValues> = {
  value: FieldValue<TFieldValue>;
  name: FieldName<TFieldValue>;
  placeholder: string;
  data: TFieldValue[];
};

const FormCombobox = forwardRef<
  HTMLInputElement,
  FormComboboxProps<FieldValues>
>(({ value: fieldValue, name: fieldName, data, placeholder }, ref) => {
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
                'w-full justify-between',
                !fieldValue && 'text-muted-foreground'
              )}
            >
              {fieldValue.name === '' || fieldValue?.length === 0
                ? placeholder
                : data.find((d) => d.name === fieldValue.name)?.name}
              <ChevronsUpDown className='opacity-50' />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className='w-full p-0'>
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
