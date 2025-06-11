import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/primitives/collapsible';
import { ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/primitives/button';

import { useState } from 'react';
import { City, CountryWithId } from '@/types/types';
import PlacesListItem from './places-list-item';

type SelectedPlacesListProps = {
  name: string;
  countries: CountryWithId[];
  onRemove: (city: City) => void;
  selectedPlaces: City[];
};

export function PlacesList({
  name,
  countries,
  selectedPlaces,
  onRemove,
}: SelectedPlacesListProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const firstPlace = selectedPlaces[0];
  const [, ...rest] = selectedPlaces;

  const getCountryCode = (countryID: number) =>
    countries.find((c) => c.id === countryID)?.code || '??';

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className=' space-y-2'>
      <div className='flex items-center justify-between space-x-4'>
        <h4 className='text-sm font-medium`'>
          Wybierz miejsce
          {name === 'loadingPlaces' ? ' załadunku' : ' rozładunku'}
        </h4>
        <CollapsibleTrigger asChild>
          <Button variant='ghost' size='sm' className='text-primary'>
            <ChevronsUpDown className='h-4 w-4' />
            <span className='sr-only'>Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <div>
        {firstPlace ? (
          <PlacesListItem
            place={firstPlace}
            onRemove={onRemove}
            country={getCountryCode(firstPlace.countryID)}
          />
        ) : (
          <span className='text-muted-foreground'>
            Nie wybrano żadnego miejsca
          </span>
        )}
      </div>
      <CollapsibleContent>
        <ul className='space-y-2'>
          {rest.map((place) => (
            <PlacesListItem
              key={place.id}
              place={place}
              onRemove={onRemove}
              country={getCountryCode(place.countryID)}
            />
          ))}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  );
}
