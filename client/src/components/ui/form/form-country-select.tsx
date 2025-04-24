import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import countriesQueryOptions from '@/features/OrderForm/queries/countriesQuery';
import { useSuspenseQuery } from '@tanstack/react-query';

import { forwardRef } from 'react';
import { FieldValue, FieldValues } from 'react-hook-form';

type FormCountrySelectProps<TFieldValues extends FieldValues> = {
  value: FieldValue<TFieldValues>;
  onChange: (value: string) => void;
};

const FormCountrySelect = forwardRef<
  HTMLSelectElement,
  FormCountrySelectProps<FieldValues>
>(({ value, onChange }, ref) => {
  const { data: countries } = useSuspenseQuery(countriesQueryOptions);

  return (
    <Select defaultValue={String(value)} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder='PL' ref={ref}></SelectValue>
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
});

export default FormCountrySelect;
