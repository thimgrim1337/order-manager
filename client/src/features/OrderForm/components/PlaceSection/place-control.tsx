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
import { forwardRef, useState } from 'react';
import { useSuspenseQueries } from '@tanstack/react-query';
import countriesQueryOptions from '../../queries/countriesQuery';
import citiesQueryOptions from '../../queries/citiesQuery';
import { useFormContext, useWatch } from 'react-hook-form';
import { City } from '@/types/types';

type PlaceControlProps = {
  name: 'loadingPlaces' | 'unloadingPlaces';
};

const PlaceControl = forwardRef<HTMLDivElement, PlaceControlProps>(
  ({ name }, ref) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const [{ data: countries }, { data: cities }] = useSuspenseQueries({
      queries: [countriesQueryOptions, citiesQueryOptions],
    });

    const { setValue } = useFormContext();
    const selectedPlaces: City[] = useWatch({ name }) || [];

    function handleSelect(city: City) {
      const isSelected = selectedPlaces.some((place) => place.id === city.id);

      if (isSelected)
        setValue(
          name,
          selectedPlaces.filter((place) => place.id !== city.id)
        );
      else
        setValue(name, [
          ...selectedPlaces,
          {
            id: city.id,
            name: city.name,
            postal: city.postal,
            countryID: city.countryID,
          },
        ]);
    }

    return (
      <>
        <PlacesList
          name={name}
          countries={countries}
          selectedPlaces={selectedPlaces}
          onRemove={handleSelect}
        />
        <PlacesCombobox
          cities={cities}
          selectedPlaces={selectedPlaces}
          onSelect={handleSelect}
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
);

export default PlaceControl;
