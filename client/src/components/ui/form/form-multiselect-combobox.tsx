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
import { forwardRef, useState } from 'react';
import {
  FieldName,
  FieldValue,
  FieldValues,
  useFormContext,
} from 'react-hook-form';
import { Badge } from '../badge';

type FormComboboxProps<TFieldValue extends FieldValues> = {
  value: FieldValue<TFieldValue>;
  name: FieldName<TFieldValue>;
  placeholder: string;
  data: TFieldValue[];
};

const FormMultiSelectCombobox = forwardRef<
  HTMLInputElement,
  FormComboboxProps<FieldValues>
>(({ value: fieldValue, name: fieldName, data, placeholder }, ref) => {
  const [selectedValues, setSelectedValues] = useState<string[]>(fieldValue);
  const { setValue } = useFormContext();

  function handleSelect(value: string) {
    if (selectedValues.includes(value)) {
      setSelectedValues((prev) =>
        prev.filter((selectedValue) => selectedValue !== value)
      );
    } else {
      setSelectedValues((prev) => [...prev, value]);
    }
  }

  function handleChangeValue(open: boolean) {
    if (!open) {
      const values = selectedValues.map((value) => {
        return {
          name: value,
        };
      });

      setValue(fieldName, values);
    }
  }

  return (
    <>
      <Popover onOpenChange={handleChangeValue}>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant='outline'
              role='combobox'
              className={cn(
                `w-full h-auto ${selectedValues.length === 0 ? 'justify-start flex-row' : 'items-start flex-col'}`,
                !selectedValues.length && 'text-muted-foreground'
              )}
            >
              {selectedValues.length === 0
                ? placeholder
                : selectedValues?.map((value) => <Badge>{value}</Badge>)}
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
                    onSelect={() => handleSelect(d.name)}
                  >
                    {d.name}

                    <Check
                      className={cn(
                        'ml-auto',
                        selectedValues.includes(d.name)
                          ? 'opacity-100'
                          : 'opacity-0'
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

export default FormMultiSelectCombobox;
