import { useCallback } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/primitives/select';
import countriesQueryOptions from '@/features/OrderForm/queries/countriesQuery';
import { FieldPath, FieldValues, useWatch } from 'react-hook-form';

type FormCountrySelectProps<TFieldValues extends FieldValues> = {
  name: FieldPath<TFieldValues>;
  onChange: (value: string) => void;
};

export default function FormCountrySelect<T extends FieldValues>({
  onChange,
  name,
}: FormCountrySelectProps<T>) {
  const { data: countries } = useSuspenseQuery(countriesQueryOptions);
  const value = useWatch<T>({ name });
  const selectHandle = useCallback(onChange, [onChange]);

  return (
    <Select defaultValue={String(value)} onValueChange={selectHandle}>
      <SelectTrigger>
        <SelectValue placeholder='PL'></SelectValue>
      </SelectTrigger>

      <SelectContent>
        {countries.map((country) => (
          <SelectItem key={country.id} value={String(country.id)}>
            {country.code}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
