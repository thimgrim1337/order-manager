import db, { dbTransaction } from '@/db/index';
import { order } from '@/db/schema/index';
import {
  and,
  asc,
  between,
  count,
  desc,
  eq,
  gte,
  ilike,
  lte,
  or,
  sql,
} from 'drizzle-orm';
import { Order, OrderFilters, OrderWithPlaces } from './orders.model';
import { ordersWithDetailsView } from '@/db/schema/order';

const DEFAULT_PAGE_INDEX = 0;
const DEFAULT_PAGE_SIZE = 10;

const analyzeGlobalFiltering = (value: string) => {
  const trimmed = value.trim();

  const numericValue = Number(trimmed);
  const isNumeric = !isNaN(numericValue) && trimmed !== '';

  // Sprawdź czy to data (formaty: YYYY-MM-DD, DD-MM-YYYY, DD/MM/YYYY, DD.MM.YYYY)
  const datePatterns = [
    /^\d{4}-\d{2}-\d{2}$/, // YYYY-MM-DD
    /^\d{2}-\d{2}-\d{4}$/, // DD-MM-YYYY
    /^\d{2}\/\d{2}\/\d{4}$/, // DD/MM/YYYY
    /^\d{2}\.\d{2}\.\d{4}$/, // DD.MM.YYYY
  ];

  const isDate = datePatterns.some((pattern) => pattern.test(trimmed));

  // Konwersja daty do formatu YYYY-MM-DD
  let normalizedDate = '';
  if (isDate) {
    if (trimmed.match(/^\d{4}-\d{2}-\d{2}$/)) {
      normalizedDate = trimmed;
    } else if (trimmed.match(/^\d{2}-\d{2}-\d{4}$/)) {
      const [day, month, year] = trimmed.split('-');
      normalizedDate = `${year}-${month}-${day}`;
    } else if (trimmed.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
      const [day, month, year] = trimmed.split('/');
      normalizedDate = `${year}-${month}-${day}`;
    } else if (trimmed.match(/^\d{2}\.\d{2}\.\d{4}$/)) {
      const [day, month, year] = trimmed.split('.');
      normalizedDate = `${year}-${month}-${day}`;
    }
  }

  return {
    isNumeric,
    isDate,
    numericValue,
    normalizedDate,
    searchTerm: `%${trimmed.toLowerCase()}%`,
  };
};

export const orderServices = {
  getOrdersQuery: async (
    pageIndex: number = DEFAULT_PAGE_INDEX,
    pageSize: number = DEFAULT_PAGE_SIZE,
    sortOptions?: { field: string; order: 'asc' | 'desc' },
    filters?: OrderFilters
  ) => {
    const sortField = sortOptions?.field;
    const sortOrder = sortOptions?.order === 'desc' ? desc : asc;

    const getSortColumn = (field?: string) => {
      const sortMappings = {
        customerID: ordersWithDetailsView.customerID,
        driverID: ordersWithDetailsView.driverID,
        truckID: ordersWithDetailsView.truckID,
        statusID: ordersWithDetailsView.status,
        loadingCity: ordersWithDetailsView.loadingCity,
        unloadingCity: ordersWithDetailsView.unloadingCity,
        orderNr: ordersWithDetailsView.orderNr,
        startDate: ordersWithDetailsView.startDate,
        endDate: ordersWithDetailsView.endDate,
        pricePLN: ordersWithDetailsView.pricePLN,
        priceCurrency: ordersWithDetailsView.priceCurrency,
        currency: ordersWithDetailsView.currency,
      };

      return (
        sortMappings[field as keyof typeof sortMappings] ||
        ordersWithDetailsView.id
      );
    };

    let query = db.select().from(ordersWithDetailsView);

    const whereConditions: any[] = [];

    if (filters?.truckID) {
      whereConditions.push(eq(ordersWithDetailsView.truckID, filters.truckID));
    }

    if (filters?.startDate) {
      whereConditions.push(
        gte(ordersWithDetailsView.startDate, filters.startDate)
      );
    }

    if (filters?.endDate) {
      whereConditions.push(lte(ordersWithDetailsView.endDate, filters.endDate));
    }

    if (filters?.globalFilters) {
      const { searchTerm, isNumeric, numericValue, isDate, normalizedDate } =
        analyzeGlobalFiltering(filters.globalFilters);

      const searchConditions = [
        ilike(ordersWithDetailsView.orderNr, searchTerm),
        ilike(ordersWithDetailsView.customer, searchTerm),
        ilike(ordersWithDetailsView.driver, searchTerm),
        ilike(ordersWithDetailsView.truck, searchTerm),
        ilike(ordersWithDetailsView.status, searchTerm),
        ilike(ordersWithDetailsView.currency, searchTerm),
        ilike(ordersWithDetailsView.loadingCity, searchTerm),
        ilike(ordersWithDetailsView.unloadingCity, searchTerm),
      ];

      if (isNumeric) {
        searchConditions.push(
          sql`${ordersWithDetailsView.pricePLN}::numeric BETWEEN ${
            numericValue - 1
          } AND ${numericValue + 1}`,
          sql`${ordersWithDetailsView.priceCurrency}::numeric BETWEEN ${
            numericValue - 1
          } AND ${numericValue + 1}`
        );
      }

      if (isDate) {
        searchConditions.push(
          eq(sql`DATE(${ordersWithDetailsView.startDate})`, normalizedDate),
          eq(sql`DATE(${ordersWithDetailsView.endDate})`, normalizedDate)
        );
      }

      whereConditions.push(or(...searchConditions));
    }

    if (whereConditions.length > 0) {
      query.where(and(...whereConditions));
    }

    return query
      .orderBy(sortOrder(getSortColumn(sortField)))
      .limit(pageSize)
      .offset(pageIndex * pageSize);
  },

  getOrderByIdQuery: async (orderID: number) => {
    const order = await db
      .select()
      .from(ordersWithDetailsView)
      .where(eq(ordersWithDetailsView.id, orderID));

    return order[0];
  },

  getOrderByNrAndCustomerQuery: async (orderNr: string, customerID: number) => {
    if (!orderNr.trim() || !customerID || customerID < 1 || isNaN(customerID))
      throw new Error(
        'OrderNr and customerID must be provided and CustomerID must be higher than 0.'
      );

    return db.query.order.findFirst({
      where: (order) =>
        and(eq(order.orderNr, orderNr), eq(order.customerID, customerID)),
    });
  },

  createOrderQuery: async (
    newOrderData: OrderWithPlaces,
    trx: dbTransaction
  ) => {
    const newOrder = await trx.insert(order).values(newOrderData).returning();

    if (!newOrder[0]) throw new Error('Failed to create order.');

    return newOrder[0];
  },

  updateOrderQuery: async (
    orderID: number,
    newOrderData: Partial<Order>,
    trx: dbTransaction
  ) => {
    const updatedOrder = await trx
      .update(order)
      .set(newOrderData)
      .where(eq(order.id, orderID))
      .returning();

    if (!updatedOrder[0]) throw new Error('Failed to update an order.');

    return updatedOrder[0];
  },

  deleteOrderQuery: async (orderID: number, trx: dbTransaction) => {
    const deletedOrder = await trx
      .delete(order)
      .where(eq(order.id, orderID))
      .returning();

    if (!deletedOrder[0]) throw new Error('Failed to delete an order.');

    return deletedOrder[0];
  },

  getOrderCount: () => db.select({ count: count() }).from(order),
};
