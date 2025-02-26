import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';

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
import { CityCreate } from '@/types/types';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { useSuspenseQuery } from '@tanstack/react-query';
import citiesQueryOptions from '../../queries/citiesQuery';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import NewPlaceForm from './new-place-form';

type PlacesComboboxProps = {
  fieldName: string;
  selectedPlaces: CityCreate[];
};

export default function PlacesCombobox({
  fieldName,
  selectedPlaces,
}: PlacesComboboxProps) {
  const { control } = useFormContext();
  const { append, remove } = useFieldArray({
    control,
    name: `${fieldName}`,
  });

  const { data: cities } = useSuspenseQuery(citiesQueryOptions);

  function handleSelect(city: CityCreate) {
    const existingPlace = selectedPlaces.findIndex(
      (place) => place.name === city.name
    );

    if (existingPlace < 0) append(city);
    else remove(existingPlace);
  }

  return (
    <FormField
      control={control}
      name={`${fieldName}`}
      render={() => (
        <FormItem className='w-full'>
          <div className='flex gap-2'>
            <NewPlaceForm onSubmit={handleSelect} />
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant='outline'
                    role='combobox'
                    className={cn(
                      'w-full justify-between text-muted-foreground'
                    )}
                  >
                    Wybierz miejsca
                    <ChevronsUpDown className='opacity-50' />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className='w-full p-0'>
                <Command>
                  <CommandInput
                    placeholder='Szukaj miejsce...'
                    className='h-9'
                  />
                  <CommandList>
                    <CommandEmpty>Nie znaleziono miejsca.</CommandEmpty>
                    <CommandGroup>
                      {cities.map((city) => (
                        <CommandItem
                          value={city.name}
                          key={city.id}
                          onSelect={() =>
                            handleSelect({
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
                              selectedPlaces.find(
                                (place) => place.name === city.name
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
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
