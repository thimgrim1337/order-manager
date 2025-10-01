import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/primitives/collapsible';
import { ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/primitives/button';

import { memo, useState } from 'react';
import { City, CountryWithId } from '@/types/types';
import PlacesListItem from './places-list-item';

type SelectedPlacesListProps = {
  countries: CountryWithId[];
  onRemove: (city: City) => void;
  selectedPlaces: City[];
};

function PlacesList({
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
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className='space-y-2 bg-zinc-200 px-2 py-2 rounded'
    >
      <div className='flex items-center justify-end '>
        <CollapsibleTrigger asChild>
          <Button
            variant='ghost'
            size='sm'
            className='text-primary absolute top-0'
          >
            <ChevronsUpDown className='h-4 w-4' />
            <span className='sr-only'>Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <div className=''>
        {firstPlace ? (
          <PlacesListItem
            place={firstPlace}
            onRemove={onRemove}
            country={getCountryCode(firstPlace.countryID)}
          />
        ) : (
          <span className='text-muted-foreground text-xs pl-2'>
            Nie wybrano żadnego miejsca
          </span>
        )}
      </div>
      <CollapsibleContent>
        <ul className='space-y-2'>
          {rest.map((place) => (
            <PlacesListItem
              key={`${place.postal} - ${place.name}`}
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

export default memo(PlacesList);
