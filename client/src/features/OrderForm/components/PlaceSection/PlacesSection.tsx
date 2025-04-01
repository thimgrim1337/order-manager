import { CityCreate } from '@/types/types';
import { SelectedPlacesList } from './PlacesList';
import PlacesCombobox from './PlacesComobox';

type PlaceSectionProps = {
  selectedLoadingPlaces: CityCreate[];
  selectedUnloadingPlaces: CityCreate[];
};

export default function PlacesSection({
  selectedLoadingPlaces,
  selectedUnloadingPlaces,
}: PlaceSectionProps) {
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
