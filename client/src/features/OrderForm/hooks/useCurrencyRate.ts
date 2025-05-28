import { useQuery } from '@tanstack/react-query';
import { fetchCurrencyRate } from '../queries/currencyRateQuery';
import { Currencies, Order } from '@/types/types';
import { useFormContext } from 'react-hook-form';
import { useEffect } from 'react';
import { getYesterday } from '@/helpers/dates';
import { fetchHolidays } from '../queries/holidaysQuery';
import { isFuture, isWeekend } from 'date-fns';

type useCurrencyRateParams = {
  currency: Currencies;
  date: string;
};

export default function useCurrencyRate({
  currency,
  date,
}: useCurrencyRateParams) {
  const currencyDate = useCurrencyDateCheck(date);
  const { setValue } = useFormContext<Order>();
  const {
    data: rate,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['rate', currency, currencyDate],
    queryFn: () => fetchCurrencyRate('A', currency, currencyDate),
  });

  useEffect(() => {
    setValue('currencyRate', String(rate ? rate.rates[0].mid : 1));
  }, [rate, setValue]);

  return { isLoading, isError, error };
}

export function useCurrencyDateCheck(date: string) {
  const { data: holidays } = useQuery({
    queryKey: ['holidays'],
    queryFn: fetchHolidays,
  });

  function checkCurrencyDate(date: string) {
    const yesterday = getYesterday(date);

    const isHoliday = holidays?.some((day) => day.endDate === yesterday);

    if (!isWeekend(yesterday) && !isFuture(yesterday) && !isHoliday)
      return yesterday;

    return checkCurrencyDate(yesterday);
  }

  return checkCurrencyDate(date);
}
