import { useState } from 'react';
import { useSuspenseQueries } from '@tanstack/react-query';
import {
  FieldPath,
  FieldValues,
  PathValue,
  useFormContext,
} from 'react-hook-form';
import PlacesCombobox from './places-combobox';
import { PlacesList } from './places-list';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/primitives/dialog';
import PlaceForm from './place-form';
import { Button } from '@/components/ui/primitives/button';
import { Plus } from 'lucide-react';
import countriesQueryOptions from '../../queries/countriesQuery';
import citiesQueryOptions from '../../queries/citiesQuery';
import { City } from '@/types/types';

type PlaceControlProps<TFieldValues extends FieldValues> = {
  name: FieldPath<TFieldValues>;
};

export default function PlaceSelector<T extends FieldValues>({
  name,
}: PlaceControlProps<T>) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [{ data: countries }, { data: cities }] = useSuspenseQueries({
    queries: [countriesQueryOptions, citiesQueryOptions],
  });

  const { setValue, watch } = useFormContext<T>();
  const selectedPlaces: City[] = watch(name) || [];

  function togglePlace(city: City) {
    const isSelected = selectedPlaces.some((place) => place.id === city.id);
    const updated = isSelected
      ? selectedPlaces.filter((place) => place.id !== city.id)
      : [...selectedPlaces, city];

    setValue(name, updated as PathValue<T, typeof name>, { shouldDirty: true });
  }

  return (
    <>
      <PlacesList
        name={name}
        countries={countries}
        selectedPlaces={selectedPlaces}
        onRemove={togglePlace}
      />
      <PlacesCombobox
        cities={cities}
        selectedPlaces={selectedPlaces}
        onSelect={togglePlace}
      />
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button>
            <Plus />
          </Button>
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
    </>
  );
}
