import {
  format,
  addDays,
  subDays,
  getWeek,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  subWeeks,
  addWeeks,
  previousFriday,
  nextMonday,
  parse,
} from 'date-fns';
import { pl } from 'date-fns/locale';

export type Day = {
  name: string;
  date: string;
};

export const formatDate = (
  date: Date | number | undefined,
  dateFormat: string = 'yyyy-MM-dd'
) => {
  if (!date) return '';

  return format(date, dateFormat, { locale: pl });
};

export const parseDate = (date: string) =>
  parse(date, 'yyyy-MM-dd', new Date());

export const getToday = () => new Date(Date.now());

export const getTomorrow = (date: Date | string) => addDays(date, 1);

export const getYesterday = (date: Date | string) => subDays(date, 1);

export const getWeekNumber = (date: Date | string) => getWeek(date).toString();

export const subWeek = (date: Date | string, count: number) =>
  subWeeks(date, count);

export const addWeek = (date: Date | string, count: number) =>
  addWeeks(date, count);

export const getFirstDayOfWeek = (date: Date | string) =>
  startOfWeek(date, { weekStartsOn: 1 });

export const getLastDayOfWeek = (date: Date | string) =>
  endOfWeek(date, { weekStartsOn: 1 });

export const getDaysOfWeek = (startDate: Date, endDate: Date): Day[] =>
  eachDayOfInterval({
    start: startDate,
    end: endDate,
  }).map((day) => ({
    name: formatDate(day, 'eeee'),
    date: formatDate(day),
  }));

export const getPreviousFriday = (date: Date | string) => previousFriday(date);

export const getNextMonday = (date: Date | string) => nextMonday(date);

export const isValidDate = (date: Date | undefined) => {
  if (!date) return false;

  return !isNaN(date.getTime());
};
