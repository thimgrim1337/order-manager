import { z } from 'zod';

export const Order = z.object({
  orderNr: z
    .string()
    .min(1, 'Za krótki nr zlecenia. > 1')
    .max(30, 'Za długi nr zlecenia. < 30'),
  startDate: z.string().date(),
  endDate: z.string().date(),
  status: z.enum(['W trakcie', 'Anulowane', 'Zakończone']).default('W trakcie'),
  pricePLN: z.coerce.number(),
  priceCurrency: z.coerce.number(),
  currency: z.enum(['EUR', 'PLN']).default('PLN'),
  currencyRate: z.number(),
  truck: z.number({ message: 'Pojazd jest wymagany.' }),
  driver: z.number({ message: 'Kierowca jest wymagany.' }),
  customer: z.number({ message: 'Zleceniodawca jest wymagany.' }),
  orderLoadingPlaces: z
    .number()
    .array()
    .min(1, 'Musisz wybrać cojanmniej 1 miejsce załadunku.'),
  orderUnloadingPlaces: z
    .number()
    .array()
    .min(1, 'Musisz wybrać conajmniej 1 miejsce rozładunku.'),
});

export type Order = z.infer<typeof Order>;
