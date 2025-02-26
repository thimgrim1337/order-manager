import { FormLabel, FormMessage } from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useSuspenseQuery } from '@tanstack/react-query';
import countriesQueryOptions from '../../queries/countriesQuery';
import { useState } from 'react';
import { CityCreate, CitySchema } from '@/types/types';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { z, ZodIssue } from 'zod';

type NewPlaceFormProps = {
  onSubmit: (newPlace: CityCreate) => void;
};

type FormDataErrors = z.inferFlattenedErrors<
  typeof CitySchema,
  { message: string; errorCode: string }
>;

const initialValues = {
  countryID: 39,
  postal: '',
  name: '',
};

export default function NewPlaceForm({ onSubmit }: NewPlaceFormProps) {
  const [place, setPlace] = useState<CityCreate>(initialValues);
  const [errors, setErrors] = useState<FormDataErrors>();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const countries = useSuspenseQuery(countriesQueryOptions);

  function changeValue(value: string | number, fieldName: string) {
    if (fieldName === 'countryID') value = +value;
    setPlace((prev) => ({ ...prev, [fieldName]: value }));
  }

  function submitPlace() {
    const result = CitySchema.safeParse(place);

    if (!result.success) {
      const errors = result.error.flatten((issue: ZodIssue) => ({
        message: issue.message,
        errorCode: issue.code,
      }));

      return setErrors(errors);
    }

    onSubmit(place);
    setPlace(initialValues);
    setIsOpen(false);
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button size={'sm'}>
          <PlusIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className='flex gap-2 my-2 items-end'>
          <div>
            <FormLabel className={errors ? 'text-red-600' : undefined}>
              Kod kraju
            </FormLabel>
            <Select
              defaultValue={place.countryID.toString()}
              onValueChange={(value) => changeValue(value, 'countryID')}
            >
              <SelectTrigger>
                <SelectValue placeholder='PL'></SelectValue>
              </SelectTrigger>
              <SelectContent>
                {countries.data.map((country) => (
                  <SelectItem key={country.id} value={country.id.toString()}>
                    {country.code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <FormLabel className={errors ? 'text-red-600' : undefined}>
              Kod pocztowy
            </FormLabel>
            <Input
              onChange={(e) => changeValue(e.target.value, 'postal')}
            ></Input>
          </div>
          <div>
            <FormLabel className={errors ? 'text-red-600' : undefined}>
              Nazwa miasta
            </FormLabel>
            <Input
              onChange={(e) => changeValue(e.target.value, 'name')}
            ></Input>
          </div>
        </div>

        {errors && (
          <FormMessage>
            {errors.fieldErrors.name?.map((e) => (
              <span className='block'>{e.message}</span>
            ))}
            {errors.fieldErrors.postal?.map((e) => (
              <span className='block'>{e.message}</span>
            ))}
          </FormMessage>
        )}

        <Button type='button' onClick={submitPlace}>
          Dodaj
        </Button>
      </PopoverContent>
    </Popover>
  );
}
