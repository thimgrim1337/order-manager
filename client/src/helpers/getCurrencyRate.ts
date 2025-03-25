import { OrderCreate } from '@/types/types';
import { yesterday } from './dates';
import { fetchCurrencyRate } from '@/features/OrderForm/queries/currencyRateQuery';

export async function getCurrencyRate(order: OrderCreate) {
  if (order.currency !== 'EUR') {
    order.pricePLN = order.priceCurrency;
    order.currencyRate = '0';

    return order;
  }

  const response = await fetchCurrencyRate(
    'a',
    'eur',
    yesterday(order.endDate)
  );

  const currencyRate = response.rates[0].mid;
  const pricePLN = parseFloat(order.priceCurrency) * currencyRate;

  order.currencyRate = String(currencyRate);
  order.pricePLN = String(pricePLN);

  return order;
}
