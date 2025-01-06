import { eq } from 'drizzle-orm';
import db from '@/db/index';
import { customer } from '@/db/schema/index';
import { Customer } from './customers.model';

export const customerServices = {
  getCustomersQuery: () =>
    db.query.customer.findMany({
      columns: {
        addressID: false,
      },
      with: {
        address: {
          columns: {
            id: false,
            countryID: false,
          },
          with: {
            country: {
              columns: {
                id: false,
              },
            },
          },
        },
      },
    }),

  getCustomerByIdQuery: (customerID: number) =>
    db.query.customer.findFirst({
      where: (customer) => eq(customer.id, customerID),
      with: {
        address: {
          columns: {
            id: false,
            countryID: false,
          },
          with: {
            country: {
              columns: {
                id: false,
              },
            },
          },
        },
      },
    }),
  getCustomerByTaxQuery: (customerTax: string) =>
    db.query.customer.findFirst({
      where: (customer) => eq(customer.tax, customerTax),
    }),
  addCustomerQuery: (newCustomer: Customer) =>
    db.insert(customer).values(newCustomer).returning(),
  deleteCustomerQuery: (customerID: number) =>
    db.delete(customer).where(eq(customer.id, customerID)).returning(),
  updateCustomerQuery: (customerToUpdate: Customer, customerID: number) =>
    db
      .update(customer)
      .set(customerToUpdate)
      .where(eq(customer.id, customerID))
      .returning(),
};
