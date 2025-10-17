import { Button } from '@/components/ui/primitives/button';
import { City } from '@/types/types';
import { X } from 'lucide-react';

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
    <li className='border-2 shadow rounded px-4 py-1 text-sm flex items-center'>
      <span className='font-medium '>{place.name}</span>
      <span className='text-muted-foreground flex-grow text-right mr-2 text-xs'>
        {country} {place.postal}
      </span>
      <Button
        aria-label={`Usuń miejsce ${place.name}`}
        type='button'
        size={'icon'}
        variant={'ghost'}
        className='group'
        onClick={() => onRemove(place)}
      >
        <X className='transition-transform group-hover:scale-110 group-hover:text-destructive' />
      </Button>
    </li>
  );
}
