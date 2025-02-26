import { useFormContext } from 'react-hook-form';
import { CityCreate } from '@/types/types';
import { SelectedPlacesList } from './places-list';
import PlacesCombobox from './place-combobox';

export default function PlaceSection() {
  const { getValues } = useFormContext();
  const selectedLoadingPlaces = getValues('loadingPlaces') as CityCreate[];
  const selectedUnloadingPlaces = getValues('unloadingPlaces') as CityCreate[];

  return (
    <div className='flex justify-between items-end gap-5'>
      <div className='flex flex-col gap-2 w-full'>
        <SelectedPlacesList
          selectedPlaces={selectedLoadingPlaces}
          fieldName='loadingPlaces'
        />
        <PlacesCombobox
          fieldName='loadingPlaces'
          selectedPlaces={selectedLoadingPlaces}
        />
      </div>
      <div className='flex flex-col gap-2 w-full'>
        <SelectedPlacesList
          selectedPlaces={selectedUnloadingPlaces}
          fieldName='unloadingPlaces'
        />
        <PlacesCombobox
          fieldName='unloadingPlaces'
          selectedPlaces={selectedUnloadingPlaces}
        />
      </div>
    </div>
  );
}
