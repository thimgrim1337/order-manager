import { CurrencyRate } from '@/types/types';

export async function fetchCurrencyRate(
  table: 'a' | 'b' | 'c',
  code: string,
  date: string
): Promise<CurrencyRate> {
  const response = await fetch(
    `https://api.nbp.pl/api/exchangerates/rates/${table}/${code}/${date}/?format=json`
  );

  //TODO:
  //Naprawić bład gdy próbujemy pobrać jeszcze nieogłoszony kurs.

  if (!response.ok) throw new Error("Can't fetch currency rate from API.");

  return (await response.json()) satisfies CurrencyRate;
}
