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
    <li
      className='rounded-md border px-4 py-2 text-sm shadow-sm flex justify-between'
      key={place.name}
    >
      {`${country} ${place.postal} ${place.name}`}
      <Button
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
