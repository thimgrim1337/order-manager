import { Button } from '@/components/ui/primitives/button';
import { City } from '@/types/types';
import { Trash } from 'lucide-react';

type PlaceListItemProps = {
  place: City;
  onRemove: (city: City) => void;
  country: string;
};

export default function PlacesListItem({
  place,
  country,
  onRemove,
}: PlaceListItemProps) {
  return (
    <li className='rounded-md border px-4 py-2 text-sm shadow-sm flex  items-center'>
      <span className='font-medium '>{place.name}</span>
      <span className='text-muted-foreground flex-grow text-right mr-2'>
        {country} {place.postal}
      </span>
      <Button
        aria-label={`Usuń miejsce ${place.name}`}
        type='button'
        size={'icon'}
        variant={'destructive'}
        onClick={() => onRemove(place)}
      >
        <Trash />
      </Button>
    </li>
  );
}
