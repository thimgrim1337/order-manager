type CurrencyRate = {
  table: string;
  currency: string;
  code: string;
  rates: [
    {
      no: string;
      effectiveDate: string;
      mid: number;
    },
  ];
};

export async function fetchCurrencyRate(
  table: 'a' | 'b' | 'c',
  code: string,
  date: string
): Promise<CurrencyRate> {
  const response = await fetch(
    `https://api.nbp.pl/api/exchangerates/rates/${table}/${code}/${date}/?format=json`
  );

  if (!response.ok) throw new Error("Can't fetch currency rate from API.");

  return await response.json();
}
