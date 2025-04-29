import { City } from '@/types/types';
import { FieldName, FieldValues } from 'react-hook-form';
import PlacesCombobox from './places-combobox';
import { PlacesList } from './places-list';
import Dialog from '@/components/ui/dialog/dialog';
import PlaceForm from './place-form';
import { Button } from '@/components/ui/primitives/button';
import { Plus } from 'lucide-react';
import { forwardRef, useState } from 'react';

type PlaceControlProps<TFieldValues extends FieldValues> = {
  selectedPlaces: City[];
  name: FieldName<TFieldValues>;
};

const PlaceControl = forwardRef<HTMLDivElement, PlaceControlProps<FieldValues>>(
  ({ name, selectedPlaces }, ref) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
      <>
        <PlacesList name={name} selectedPlaces={selectedPlaces} />
        <PlacesCombobox ref={ref} name={name} selectedPlaces={selectedPlaces} />
        <Dialog
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          trigger={
            <Button className='self-start' size='sm'>
              <Plus />
            </Button>
          }
          description='Wprowadź dane aby dodać nowe miejsce.'
          title='Dodaj nowe miejsce'
        >
          <PlaceForm name={name} onOpenChange={setIsOpen} />
        </Dialog>
      </>
    );
  }
);

export default PlaceControl;
