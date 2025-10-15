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
  longDate: string;
  shortDate: string;
};

export const formatDate = (
  date: Date | number | string | undefined,
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

export const getFirstDay = (date: Date | string) =>
  startOfWeek(date, { weekStartsOn: 1 });

export const getLastDay = (date: Date | string) =>
  endOfWeek(addWeek(date, 1), { weekStartsOn: 1 });

export const getTwoWeekDays = (startDate: Date, endDate: Date): Day[] =>
  eachDayOfInterval({
    start: startDate,
    end: endDate,
  }).map((day) => ({
    name: formatDate(day, 'eee'),
    longDate: formatDate(day),
    shortDate: formatDate(day, 'dd.MM'),
  }));

export const getPreviousFriday = (date: Date | string) => previousFriday(date);

export const getNextMonday = (date: Date | string) => nextMonday(date);

export const isValidDate = (date: Date | undefined) => {
  if (!date) return false;

  return !isNaN(date.getTime());
};

const today = getToday();
export const initialDate = formatDate(getFirstDay(today));
