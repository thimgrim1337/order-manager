import { z } from 'zod';

const ALLOWED_SORT_FIELDS = [
  'id',
  'orderNr',
  'startDate',
  'endDate',
  'statusID',
  'truckID',
  'customerID',
  'driverID',
  'loadingCity',
  'unloadingCity',
  'priceCurrency',
  'currency',
  'pricePLN',
];

type AllowedSortFields = (typeof ALLOWED_SORT_FIELDS)[number];

export const PaginationParams = z.object({
  pageIndex: z
    .string()
    .transform((val) => {
      const num = Number(val);
      if (isNaN(num) || num < 0)
        throw new Error('pageIndex must be a non-negative number.');

      return num;
    })
    .default('0'),
  pageSize: z
    .string()
    .transform((val) => {
      const num = Number(val);
      if (isNaN(num) || num < 1 || num > 100)
        throw new Error('pageSize must be between 1 and 100.');
      return num;
    })
    .default('10'),
});
export type PaginationParams = z.infer<typeof PaginationParams>;

export const SortParams = z.object({
  sortBy: z
    .string()
    .regex(
      /^[\w]+\.(asc|desc)$/,
      'Invalid sort format. Use: field.asc or field.desc'
    )
    .transform((val) => {
      const [field, order] = val.split('.') as [string, 'asc' | 'desc'];

      if (!ALLOWED_SORT_FIELDS.includes(field as AllowedSortFields))
        throw new Error(
          `Invalid sort field ${field}. Allowed fields: ${ALLOWED_SORT_FIELDS.join(
            ', '
          )}`
        );
      return { field: field as AllowedSortFields, order };
    })
    .optional(),
});
export type SortParams = z.infer<typeof SortParams>;
