import {
  format,
  addDays,
  subDays,
  getWeek,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
} from 'date-fns';
import { pl } from 'date-fns/locale';

export type Day = {
  name: string;
  date: string;
};

export const getToday = () => format(Date.now(), 'yyyy-MM-dd', { locale: pl });

export const getTomorrow = (date: string) =>
  format(addDays(date, 1), 'yyyy-MM-dd');

export const getYesterday = (date: string) =>
  format(subDays(date, 1), 'yyyy-MM-dd');

export const getWeekNumber = (date: string) => getWeek(date);

export const getFirstDayOfWeek = (date: string) =>
  startOfWeek(date, { weekStartsOn: 1 });

export const getLastDayOfWeek = (date: string) =>
  endOfWeek(date, { weekStartsOn: 1 });

export const getDaysOfWeek = (startDate: Date, endDate: Date): Day[] =>
  eachDayOfInterval({
    start: startDate,
    end: endDate,
  }).map((day) => ({
    name: format(day, 'eeee', { locale: pl }),
    date: format(day, 'yyyy-MM-dd', { locale: pl }),
  }));
