import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronsUpDown, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { useState } from 'react';
import { CityCreate } from '@/types/types';
import { useSuspenseQuery } from '@tanstack/react-query';
import countriesQueryOptions from '../../queries/countriesQuery';

type SelectedPlacesListProps = {
  selectedPlaces: CityCreate[];
  fieldName: string;
};

export function SelectedPlacesList({
  selectedPlaces,
  fieldName,
}: SelectedPlacesListProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { control } = useFormContext();
  const { remove } = useFieldArray({
    control,
    name: `${fieldName}`,
  });
  const { data: countries } = useSuspenseQuery(countriesQueryOptions);

  const firstPlace = selectedPlaces[0];
  const [, ...rest] = selectedPlaces;

  function handleRemove(placeRemove: CityCreate) {
    const index = selectedPlaces.findIndex(
      (place) => place.name === placeRemove.name
    );

    if (index < 0) return;

    remove(index);
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className=' space-y-2'>
      <div className='flex items-center justify-between space-x-4'>
        <h4 className='text-sm'>
          Wybierz miejsce
          {fieldName === 'loadingPlaces' ? 'załadunku' : 'rozładunku'}
        </h4>
        <CollapsibleTrigger asChild>
          <Button variant='ghost' size='sm' className='text-primary-foreground'>
            <ChevronsUpDown className='h-4 w-4' />
            <span className='sr-only'>Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <div className='rounded-md border px-4 py-2  text-sm shadow-sm'>
        {firstPlace ? (
          <span className='flex justify-between'>
            {`${countries[firstPlace.countryID - 1].code} ${firstPlace.postal} ${firstPlace.name}`}
            <Button
              type='button'
              size={'icon'}
              variant={'destructive'}
              onClick={() => handleRemove(firstPlace)}
            >
              <Trash />
            </Button>
          </span>
        ) : (
          <span className='text-muted-foreground'>
            Nie wybrano żadnego miejsca
          </span>
        )}
      </div>
      <CollapsibleContent>
        <ul className='space-y-2'>
          {rest.map((place) => (
            <li
              className='rounded-md border px-4 py-2 text-sm shadow-sm flex justify-between'
              key={place.name}
            >
              {`${countries[place.countryID - 1].code} ${place.postal} ${place.name}`}
              <Button
                type='button'
                size={'icon'}
                variant={'destructive'}
                onClick={() => handleRemove(place)}
              >
                <Trash />
              </Button>
            </li>
          ))}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  );
}
