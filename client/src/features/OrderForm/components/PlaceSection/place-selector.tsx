import { memo, useState } from 'react';
import { useQueries } from '@tanstack/react-query';
import PlacesCombobox from './places-combobox';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/primitives/dialog';
import PlaceForm from './place-form';
import countriesQueryOptions from '../../queries/countriesQuery';
import citiesQueryOptions from '../../queries/citiesQuery';
import { City } from '@/types/types';
import PlacesList from './places-list';
import PlusButton from '@/components/ui/buttons/plus-button';

type PlaceControlProps = {
  onChange: (value: City[]) => void;
  name: string;
  value: City[];
};

function PlaceSelector({ name, value, onChange }: PlaceControlProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [{ data: countries }, { data: cities }] = useQueries({
    queries: [countriesQueryOptions, citiesQueryOptions],
  });

  function togglePlace(city: City) {
    const isSelected = value?.some((place) => place.name === city.name);
    const updated = isSelected
      ? value.filter((place) => place.name !== city.name)
      : [...(value || []), city];

    onChange(updated);
  }

  return (
    <>
      <PlacesList
        countries={countries || []}
        selectedPlaces={value || []}
        onRemove={togglePlace}
      />
      <div className='flex items-center gap-2'>
        <PlacesCombobox
          cities={cities || []}
          selectedPlaces={value || []}
          onSelect={togglePlace}
        />
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <PlusButton variant={'link'} />
          </DialogTrigger>
          <DialogContent className='max-w-screen-sm'>
            <DialogHeader>
              <DialogTitle>Dodaj nowe miasto</DialogTitle>
              <DialogDescription>
                Wypełnij wszystkie pola aby dodać nowe miasto.
              </DialogDescription>
            </DialogHeader>
            <PlaceForm name={name} onOpenChange={setIsOpen} />
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}

export default memo(PlaceSelector);
