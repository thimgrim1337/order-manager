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

export const getToday = () => new Date(Date.now());

export const getTomorrow = (date: Date) => addDays(date, 1);

export const getYesterday = (date: string) => formatDate(subDays(date, 1));

export const getWeekNumber = (date: string) => getWeek(date).toString();

export const subWeek = (date: string, count: number) =>
  formatDate(subWeeks(date, count));

export const addWeek = (date: string, count: number) =>
  formatDate(addWeeks(date, count));

export const getFirstDayOfWeek = (date: string) =>
  formatDate(startOfWeek(date, { weekStartsOn: 1 }));

export const getLastDayOfWeek = (date: string) =>
  formatDate(endOfWeek(date, { weekStartsOn: 1 }));

export const getDaysOfWeek = (startDate: string, endDate: string): Day[] =>
  eachDayOfInterval({
    start: startDate,
    end: endDate,
  }).map((day) => ({
    name: formatDate(day, 'eeee'),
    date: formatDate(day),
  }));

export const getPreviousFriday = (date: string) =>
  formatDate(previousFriday(date));

export const getNextMonday = (date: string) => formatDate(nextMonday(date));

export const isValidDate = (date: Date | undefined) => {
  if (!date) return false;

  return !isNaN(date.getTime());
};
