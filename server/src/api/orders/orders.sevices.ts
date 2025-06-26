import db from '@/db/index';
import { order } from '@/db/schema/index';
import { and, eq, gte, lte } from 'drizzle-orm';
import { Order } from './orders.model';

export const orderServices = {
  getOrdersQuery: (page = 1, pageSize = 10) =>
    db.query.order.findMany({
      orderBy: (order, { asc }) => asc(order.id),
      limit: pageSize,
      offset: (page - 1) * pageSize,
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
    }),
  getOrderByIdQuery: (orderID: number) =>
    db.query.order.findFirst({
      where: (order) => eq(order.id, orderID),
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
    }),
  getOrderByNrAndCustomerQuery: (orderNr: string, customerID: number) =>
    db.query.order.findFirst({
      where: (order) =>
        and(eq(order.orderNr, orderNr), eq(order.customerID, customerID)),
    }),
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

  addOrderQuery: (newOrder: Order) =>
    db.insert(order).values(newOrder).returning(),
  deleteOrderQuery: (orderID: number) =>
    db.delete(order).where(eq(order.id, orderID)).returning(),
  updateOrderQuery: (orderID: number, updatedOrder: Order) =>
    db.update(order).set(updatedOrder).where(eq(order.id, orderID)).returning(),
};
