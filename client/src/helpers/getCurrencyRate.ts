import { Order, OrderWithId } from '@/types/types';
import { fetchCurrencyRate } from '@/features/OrderForm/queries/currencyRateQuery';
import { getYesterday } from './dates';

export async function getCurrencyRate<T extends Order | OrderWithId>(order: T) {
  if (order.currency !== 'EUR') {
    order.pricePLN = order.priceCurrency;
    order.currencyRate = '0';

    return order;
  }

  const response = await fetchCurrencyRate(
    'a',
    'eur',
    getYesterday(order.endDate)
  );

  const currencyRate = response.rates[0].mid;
  const pricePLN = parseFloat(order.priceCurrency) * currencyRate;

  order.currencyRate = String(currencyRate);
  order.pricePLN = String(pricePLN);

  return order;
}
