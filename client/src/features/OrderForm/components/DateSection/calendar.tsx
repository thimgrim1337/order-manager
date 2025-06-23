import { Button } from '@/components/ui/primitives/button';
import { Calendar as DatePicker } from '@/components/ui/primitives/calendar';
import { Input } from '@/components/ui/primitives/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/primitives/popover';
import { formatDate, getToday, isValidDate, parseDate } from '@/helpers/dates';
import { CalendarIcon } from 'lucide-react';
import { ChangeEvent, useState } from 'react';
import { useFormContext } from 'react-hook-form';

const today = getToday();

type CalendarProps = {
  name: string;
};

export function Calendar({ name }: CalendarProps) {
  const { setValue, watch } = useFormContext();
  const value = watch(name);
  const existingDate = parseDate(watch(name));

  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(existingDate || today);

  let formatedDate = formatDate(value);

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    const date = new Date(e.target.value);
    formatedDate = formatDate(value);

    setValue(name, formatedDate);

    if (isValidDate(date)) {
      setDate(date);
    }
  }

  function handleSelectDate(date: Date | undefined) {
    if (isValidDate(date)) {
      setValue(name, formatDate(date));
      setDate(date);
      setOpen(false);
    }
  }

  return (
    <div className='relative'>
      <Input
        value={formatedDate}
        onChange={handleInputChange}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            setOpen(true);
          }
        }}
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id='date-picker'
            variant='ghost'
            className='absolute top-1/2 right-2 size-6 -translate-y-1/2'
          >
            <CalendarIcon className='size-3.5' />
            <span className='sr-only'>Wybierz datę</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className='w-auto overflow-hidden p-0'
          align='end'
          alignOffset={-8}
          sideOffset={10}
        >
          <DatePicker
            mode='single'
            selected={date}
            captionLayout='dropdown'
            month={date}
            onMonthChange={setDate}
            onSelect={(date) => handleSelectDate(date)}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
