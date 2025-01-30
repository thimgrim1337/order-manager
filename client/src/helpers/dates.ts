import { format, addDays, subDays } from 'date-fns';

export const today = format(Date.now(), 'yyyy-MM-dd');
export const tomorrow = format(addDays(Date.now(), 1), 'yyyy-MM-dd');
export const yesterday = (date: string) =>
  format(subDays(date, 1), 'yyyy-MM-dd');
