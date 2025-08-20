import { Button } from '../primitives/button';
import { Check, ChevronsUpDown, LoaderCircle } from 'lucide-react';
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
import { FieldPath, FieldValues, useWatch } from 'react-hook-form';

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
  isFetching?: boolean;
};

export default function FormCombobox<T extends FieldValues>({
  name,
  placeholder,
  data,
  onChange,
  onFiltersChange,
  isFetching,
}: FormComboboxProps<T>) {
  const selectedValue = useWatch({ name });

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
              'w-full justify-between overflow-clip',
              !selectedValue && 'text-muted-foreground'
            )}
          >
            {selectedValue === undefined ||
            selectedValue === 0 ||
            selectedValue === ''
              ? placeholder
              : data.find((d) => d.id === selectedValue)?.name}
            <ChevronsUpDown className='opacity-50' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className=' p-0'>
          <Command>
            <CommandInput
              placeholder='Szukaj...'
              className='h-9'
              onValueChange={onFiltersChange}
            />
            <CommandList id='combobox-list'>
              <CommandEmpty>Nic nie znaleziono.</CommandEmpty>
              <CommandGroup>
                {isFetching && <LoaderCircle className='animate-spin' />}
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
