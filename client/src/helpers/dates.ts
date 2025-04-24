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
} from 'date-fns';
import { pl } from 'date-fns/locale';

export type Day = {
  name: string;
  date: string;
};

const formatDate = (date: Date | number, dateFormat: string = 'yyyy-MM-dd') =>
  format(date, dateFormat, { locale: pl });

export const getToday = () => formatDate(Date.now());

export const getTomorrow = (date: string) => formatDate(addDays(date, 1));

export const getYesterday = (date: string) => formatDate(subDays(date, 1));

export const getWeekNumber = (date: string) => getWeek(date).toString();

export const subWeek = (date: string, count: number) =>
  formatDate(subWeeks(date, count));

export const addWeek = (date: string, count: number) =>
  formatDate(addWeeks(date, count));

export const getFirstDayOfWeek = (date: string) =>
  startOfWeek(date, { weekStartsOn: 1 });

export const getLastDayOfWeek = (date: string) =>
  endOfWeek(date, { weekStartsOn: 1 });

export const getDaysOfWeek = (startDate: Date, endDate: Date): Day[] =>
  eachDayOfInterval({
    start: startDate,
    end: endDate,
  }).map((day) => ({
    name: formatDate(day, 'eeee'),
    date: formatDate(day),
  }));
