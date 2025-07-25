import db, { dbTransaction } from '@/db/index';
import { customer, driver, order, status, truck } from '@/db/schema/index';
import {
  and,
  asc,
  count,
  desc,
  eq,
  getTableColumns,
  gte,
  lte,
  or,
  sql,
} from 'drizzle-orm';
import { Order, OrderFilters, OrderWithPlaces } from './orders.model';
import { City } from '../cities/cities.model';

const DEFAULT_PAGE_INDEX = 0;
const DEFAULT_PAGE_SIZE = 10;

export const orderServices = {
  getOrdersQuery: async (
    pageIndex: number = DEFAULT_PAGE_INDEX,
    pageSize: number = DEFAULT_PAGE_SIZE,
    sortOptions?: { field: string; order: 'asc' | 'desc' },
    filters?: OrderFilters
  ) => {
    const sortField = sortOptions?.field;
    const sortOrder = sortOptions?.order === 'desc' ? desc : asc;

    // Subquery dla szczegółowych miejsc załadunku (JSON array)
    const loadingPlacesQuery = sql<string>`(
    SELECT COALESCE(
      JSON_AGG(
        JSON_BUILD_OBJECT(
          'id', lc.id,
          'name', lc.name,
          'postal', lc.postal,
          'countryID', lc.country_id
        ) ORDER BY lc.name
      ), 
      '[]'::json
    )
    FROM order_loading_places lp 
    JOIN city lc ON lp.place_id = lc.id 
    WHERE lp.order_id = "order".id
  )`;

    // Subquery dla szczegółowych miejsc rozładunku (JSON array)
    const unloadingPlacesQuery = sql<string>`(
    SELECT COALESCE(
      JSON_AGG(
        JSON_BUILD_OBJECT(
          'id', uc.id,
          'name', uc.name,
          'postal', uc.postal,
          'countryID', uc.country_id
        ) ORDER BY uc.name
      ), 
      '[]'::json
    )
    FROM order_unloading_places up 
    JOIN city uc ON up.place_id = uc.id 
    WHERE up.order_id = "order".id
  )`;

    const firstLoadingCityQuery = sql<string>`(
      SELECT lc.name
      FROM order_loading_places lp
      JOIN city lc ON lp.place_id = lc.id
      WHERE lp.order_id = "order".id
      LIMIT 1
    )`;

    const firstUnloadingCityQuery = sql<string>`(
      SELECT uc.name
      FROM order_unloading_places up
      JOIN city uc ON up.place_id = uc.id
      WHERE up.order_id = "order".id
      LIMIT 1
    )`;

    const getOrderByClause = () => {
      switch (sortField) {
        case 'loadingCity':
          return sortOrder(firstLoadingCityQuery);
        case 'unloadingCity':
          return sortOrder(firstUnloadingCityQuery);
        default:
          return sortField && sortField in order
            ? sortOrder(order[sortField as keyof Order])
            : sortOrder(order.id);
      }
    };

    const query = db
      .select({
        ...getTableColumns(order),
        customer: customer.name,
        driver:
          sql<string>`CONCAT(${driver.firstName}, ' ', ${driver.lastName})`.as(
            'driver'
          ),
        truck: truck.plate,
        status: status.name,
        loadingPlaces: loadingPlacesQuery.as('loadingPlacesRaw'),
        unloadingPlaces: unloadingPlacesQuery.as('unloadingPlacesRaw'),
        loadingCity: firstLoadingCityQuery.as('loadingCity'),
        unloadingCity: firstUnloadingCityQuery.as('unloadingCity'),
      })
      .from(order)
      .leftJoin(customer, eq(order.customerID, customer.id))
      .leftJoin(driver, eq(order.driverID, driver.id))
      .leftJoin(truck, eq(order.truckID, truck.id))
      .leftJoin(status, eq(order.statusID, status.id));

    const rawResults = await query
      .orderBy(getOrderByClause())
      .limit(pageSize)
      .offset(pageIndex * pageSize);

    return rawResults.map((row) => {
      const {
        loadingPlaces,
        unloadingPlaces,
        loadingCity,
        unloadingCity,
        ...orderData
      } = row;

      return {
        ...orderData,
        loadingCity: loadingCity || '',
        unloadingCity: unloadingCity || '',
        loadingPlaces: loadingPlaces as unknown as City[],
        unloadingPlaces: unloadingPlaces as unknown as City[],
      };
    });
  },

  getOrderByIdQuery: async (orderID: number) => {
    const order = await db.query.order.findFirst({
      where: (order, { eq }) => eq(order.id, orderID),
      with: {
        status: true,
        truck: true,
        customer: true,
        driver: true,
        loadingPlaces: {
          with: {
            place: true,
          },
        },
        unloadingPlaces: {
          with: {
            place: true,
          },
        },
      },
    });

    if (!order) return null;

    const loadingPlaces = order?.loadingPlaces.map((p) => p.place) || [];
    const unloadingPlaces = order?.unloadingPlaces.map((p) => p.place) || [];
    const driverFullName = order.driver
      ? `${order.driver.firstName || ''} ${order.driver.lastName || ''}`.trim()
      : 'N/A';

    return {
      ...order,
      driver: driverFullName,
      customer: order.customer?.name || 'N/A',
      truck: order.truck?.plate || 'N/A',
      status: order.status?.name || 'N/A',
      loadingPlaces,
      unloadingPlaces,
      loadingCity: loadingPlaces[0]?.name || 'N/A',
      unloadingCity: unloadingPlaces[0]?.name || 'N/A',
    };
  },

  getOrderByNrAndCustomerQuery: async (orderNr: string, customerID: number) => {
    if (!orderNr.trim() || !customerID || customerID < 1 || isNaN(customerID))
      throw new Error(
        'OrderNr and customerID must be provided and higher than 0.'
      );

    const order = await db.query.order.findFirst({
      where: (order) =>
        and(eq(order.orderNr, orderNr), eq(order.customerID, customerID)),
      with: {
        status: true,
        truck: true,
        customer: true,
        driver: true,
        loadingPlaces: {
          with: {
            place: true,
          },
        },
        unloadingPlaces: {
          with: {
            place: true,
          },
        },
      },
    });

    if (!order) return null;

    const loadingPlaces = order?.loadingPlaces.map((p) => p.place) || [];
    const unloadingPlaces = order?.unloadingPlaces.map((p) => p.place) || [];

    return {
      ...order,
      driver: order.driver
        ? `${order.driver.firstName || ''} ${
            order.driver.lastName || ''
          }`.trim()
        : 'N/A',
      customer: order.customer?.name || 'N/A',
      truck: order.truck?.plate || 'N/A',
      status: order.status?.name || 'N/A',
      loadingPlaces,
      unloadingPlaces,
      loadingCity: loadingPlaces[0]?.name || 'N/A',
      unloadingCity: unloadingPlaces[0]?.name || 'N/A',
    };
  },

  getOrderByTruckIdAndDatesQuery: (
    truckID: number,
    startDate: string | undefined,
    endDate: string | undefined
  ) => {
    return db.query.order.findMany({
      where: (order) =>
        and(
          eq(order.truckID, truckID),
          startDate ? gte(order.startDate, startDate) : undefined,
          endDate ? lte(order.endDate, endDate) : undefined
        ),
      with: {
        loadingPlaces: {
          columns: {
            id: false,
            orderID: false,
            placeID: false,
          },
          with: {
            place: true,
          },
        },
        unloadingPlaces: {
          columns: {
            id: false,
            orderID: false,
            placeID: false,
          },
          with: {
            place: true,
          },
        },
        status: {
          columns: {
            name: true,
          },
        },
        truck: {
          columns: {
            plate: true,
          },
        },
        driver: {
          columns: {
            firstName: true,
            lastName: true,
          },
        },
        customer: {
          columns: {
            name: true,
          },
        },
      },
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
