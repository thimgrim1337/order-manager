import { format, addDays } from 'date-fns';

export const today = format(Date.now(), 'yyyy-MM-dd');
export const tomorrow = format(addDays(Date.now(), 1), 'yyyy-MM-dd');
