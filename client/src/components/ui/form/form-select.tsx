import { forwardRef } from 'react';
import { FormControl } from '../form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../select';

type FormSelectProps = {
  value: string;
  onChange: (value: string) => void;
  data: string[];
  placeholder: string;
};

const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ value, onChange, data, placeholder }, ref) => {
    return (
      <Select onValueChange={onChange} defaultValue={value}>
        <FormControl ref={ref}>
          <SelectTrigger>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {data.map((d) => (
            <SelectItem value={d} key={d}>
              {d}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }
);

export default FormSelect;
