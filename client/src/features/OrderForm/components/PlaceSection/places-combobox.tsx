import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/primitives/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/primitives/popover';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/primitives/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';
import { City } from '@/types/types';

type PlacesComboboxProps = {
  cities: City[];
  onSelect: (city: City) => void;
  selectedPlaces: City[];
};

export default function PlacesCombobox({
  cities,
  onSelect,
  selectedPlaces,
}: PlacesComboboxProps) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          aria-label='Wybierz miejsca'
          variant='outline'
          role='combobox'
          className={cn('w-full justify-between')}
        >
          Wybierz miejsca
          <ChevronsUpDown className='opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-full p-0'>
        <Command>
          <CommandInput placeholder='Szukaj miejsce...' className='h-9' />
          <CommandList>
            <CommandEmpty>Nie znaleziono miejsca.</CommandEmpty>
            <CommandGroup>
              {cities.map((city) => (
                <CommandItem
                  value={city.name}
                  key={city.id}
                  onSelect={() => onSelect(city)}
                >
                  {city.name}
                  <Check
                    className={cn(
                      'ml-auto',
                      selectedPlaces.some((p) => p.id === city.id)
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
  );
}
