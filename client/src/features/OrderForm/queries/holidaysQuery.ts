import { OpenHolidaysResponse } from '@/types/types';

export async function fetchHolidays(): Promise<OpenHolidaysResponse[]> {
  const response = await fetch('http://localhost:3000/api/v1/holidays');

  if (!response.ok) throw new Error('Failed to fetch holidays.');

  const holidays = (await response.json()) as OpenHolidaysResponse[];

  return holidays;
}
