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
import { City, CityWithId } from '@/types/types';

type PlacesComboboxProps = {
  cities: CityWithId[];
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
          variant='outline'
          role='combobox'
          className={cn('w-full justify-between text-muted-foreground')}
        >
          Wybierz miejsca
          <ChevronsUpDown className='opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-full p-0 min-w-96'>
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
                      selectedPlaces.some(
                        (selectedPlace) => selectedPlace.id === city.id
                      )
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
