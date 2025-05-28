import { Currencies, CurrencyRate } from '@/types/types';

export async function fetchCurrencyRate(
  table: 'A' | 'B' | 'C',
  code: Currencies,
  date: string
): Promise<CurrencyRate | null> {
  if (code === 'PLN') return null;

  const response = await fetch(
    `https://api.nbp.pl/api/exchangerates/rates/${table}/${code}/${date}/?format=json`
  );

  if (!response.ok && response.status === 404)
    throw new Error(`Failed to fetch currency rate ${code} for date: ${date}.`);

  if (!response.ok)
    throw new Error(`FDailed to fetch currency rate. Please try again later.`);

  return (await response.json()) satisfies CurrencyRate;
}
