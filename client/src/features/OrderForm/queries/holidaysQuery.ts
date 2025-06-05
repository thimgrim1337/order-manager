import { OpenHolidaysResponse } from '@/types/types';

export async function fetchHolidays(): Promise<OpenHolidaysResponse[]> {
  const response = await fetch('api/v1/holidays');

  if (!response.ok) throw new Error('Failed to fetch holidays.');

  const holidays = (await response.json()) as OpenHolidaysResponse[];

  return holidays;
}
