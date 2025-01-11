import db from '@/db/index';
import { order } from '@/db/schema/index';
import { and, eq } from 'drizzle-orm';
import { Order } from './orders.model';

export const orderServices = {
  getOrdersQuery: () =>
    db.query.order.findMany({
      with: {
        orderLoadingPlaces: {
          columns: {
            placeID: true,
          },
          with: {
            place: {
              columns: {
                name: true,
              },
            },
          },
        },
        orderUnloadingPlaces: {
          columns: {
            placeID: true,
          },
          with: {
            place: {
              columns: {
                name: true,
              },
            },
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
        orderLoadingPlaces: {
          columns: {
            placeID: true,
          },
        },
        orderUnloadingPlaces: {
          columns: {
            placeID: true,
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
  addOrderQuery: (newOrder: Order) =>
    db.insert(order).values(newOrder).returning(),
  deleteOrderQuery: (orderID: number) =>
    db.delete(order).where(eq(order.id, orderID)).returning(),
  updateOrderQuery: (orderID: number, updatedOrder: Order) =>
    db.update(order).set(updatedOrder).where(eq(order.id, orderID)).returning(),
};
