import { Button } from '../primitives/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../primitives/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../primitives/command';
import { cn } from '@/lib/utils';
import { FieldPath, FieldValues, useFormContext } from 'react-hook-form';

type ComboboxOption = {
  id: string | number;
  name: string;
};

type FormComboboxProps<TFieldValues extends FieldValues> = {
  name: FieldPath<TFieldValues>;
  placeholder: string;
  data: ComboboxOption[];
  onChange: (id: string | number) => void;
  onFiltersChange?: (filter: string) => void;
};

export default function FormCombobox<T extends FieldValues>({
  name,
  placeholder,
  data,
  onChange,
  onFiltersChange,
}: FormComboboxProps<T>) {
  const { watch } = useFormContext<T>();
  const selectedValue = watch(name);

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            role='combobox'
            aria-expanded='true'
            aria-controls='combobox-list'
            className={cn(
              'w-full justify-between',
              !selectedValue && 'text-muted-foreground'
            )}
          >
            {selectedValue === undefined || selectedValue === ''
              ? placeholder
              : data.find((d) => d.id === selectedValue)?.name}
            <ChevronsUpDown className='opacity-50' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-full p-0'>
          <Command>
            <CommandInput
              placeholder='Szukaj...'
              className='h-9'
              onValueChange={onFiltersChange}
            />
            <CommandList id='combobox-list'>
              <CommandEmpty>Nic nie znaleziono.</CommandEmpty>
              <CommandGroup>
                {data.map((d) => (
                  <CommandItem
                    aria-selected={d.id === selectedValue}
                    value={d.name}
                    key={d.id}
                    onSelect={() => onChange(d.id)}
                    onBlur={() => onChange(d.id)}
                  >
                    {d.name}
                    <Check
                      className={cn(
                        'ml-auto',
                        d.id !== selectedValue && 'opacity-0'
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
}
