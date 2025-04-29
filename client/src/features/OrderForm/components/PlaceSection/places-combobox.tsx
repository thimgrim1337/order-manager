import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { City } from '@/types/types';
import { useSuspenseQuery } from '@tanstack/react-query';
import citiesQueryOptions from '../../queries/citiesQuery';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import {
  FieldName,
  FieldValues,
  useFieldArray,
  useFormContext,
} from 'react-hook-form';
import { forwardRef } from 'react';

type PlacesComboboxProps<TFieldValues extends FieldValues> = {
  name: FieldName<TFieldValues>;
  selectedPlaces: City[];
};

const PlacesCombobox = forwardRef<
  HTMLDivElement,
  PlacesComboboxProps<FieldValues>
>(({ name, selectedPlaces }, ref) => {
  const { data: cities } = useSuspenseQuery(citiesQueryOptions);
  const { control } = useFormContext();
  const { append, remove } = useFieldArray({
    name,
    control,
    keyName: '_id',
  });

  function onSelect(selectedPlace: City) {
    const index = selectedPlaces.findIndex(
      (place) => place.id === selectedPlace.id
    );

    return index === -1 ? append(selectedPlace) : remove(index);
  }

  return (
    <Popover>
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
      <PopoverContent className='w-full p-0'>
        <Command ref={ref}>
          <CommandInput placeholder='Szukaj miejsce...' className='h-9' />
          <CommandList>
            <CommandEmpty>Nie znaleziono miejsca.</CommandEmpty>
            <CommandGroup>
              {cities.map((city) => (
                <CommandItem
                  value={city.name}
                  key={city.id}
                  onSelect={() =>
                    onSelect({
                      id: city.id,
                      name: city.name,
                      postal: city.postal,
                      countryID: city.countryID,
                    })
                  }
                >
                  {city.name}
                  <Check
                    className={cn(
                      'ml-auto',
                      selectedPlaces.find((place) => place.id === city.id)
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
});

export default PlacesCombobox;
