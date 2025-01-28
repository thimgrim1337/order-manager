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

type SelectedValue = {
  id: number;
  name: string;
};

const FormMultiSelectCombobox = forwardRef<
  HTMLInputElement,
  FormComboboxProps<FieldValues>
>(({ value: fieldValue, name: fieldName, data, placeholder }, ref) => {
  const [selectedValues, setSelectedValues] =
    useState<SelectedValue[]>(fieldValue);
  const { setValue } = useFormContext();

  function handleSelect(value: SelectedValue) {
    if (selectedValues.some((selectedValue) => selectedValue.id === value.id)) {
      setSelectedValues((prev) =>
        prev.filter((selectedValue) => selectedValue.id !== value.id)
      );
    } else {
      setSelectedValues((prev) => [...prev, value]);
    }
  }

  function handleChangeValue(open: boolean) {
    const values = selectedValues.map((selectedValue) => selectedValue.id);
    if (!open) {
      setValue(fieldName, values, { shouldDirty: true });
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
                : selectedValues.map((value) => (
                    <Badge key={value.id}>{value.name}</Badge>
                  ))}
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
                    key={d.id}
                    ref={ref}
                    onSelect={() =>
                      handleSelect({
                        id: d.id,
                        name: d.name,
                      })
                    }
                  >
                    {d.name}

                    <Check
                      className={cn(
                        'ml-auto',
                        selectedValues.some((value) => value.id === d.id)
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
