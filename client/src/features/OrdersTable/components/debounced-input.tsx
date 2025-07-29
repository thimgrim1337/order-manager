import { Input } from '@/components/ui/primitives/input';
import { InputHTMLAttributes, useEffect, useState } from 'react';

type DebouncedInputProps = {
  value: string;
  onChange: (value: string | number) => void;
  debounce?: number;
};

export default function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 200,
  ...props
}: DebouncedInputProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
  const [value, setValue] = useState<string | number>(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <Input
      {...props}
      value={value ?? ''}
      onChange={(e) => {
        if (e.target.value === '') return setValue('');
        if (props.type === 'number') {
          setValue(e.target.valueAsNumber);
        } else {
          setValue(e.target.value);
        }
      }}
    />
  );
}
