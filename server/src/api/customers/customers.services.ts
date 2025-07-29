import { eq } from 'drizzle-orm';
import db from '@/db/index';
import { customer } from '@/db/schema/index';
import { Customer } from './customers.model';

export const customerServices = {
  getCustomersQuery: () => db.query.customer.findMany(),

  getCustomerByIdQuery: (customerID: number) => {
    if (!customerID || customerID < 1)
      throw new Error('CustomerID must be provided and higher than 0.');
    return db.query.customer.findFirst({
      where: (customer) => eq(customer.id, customerID),
    });
  },

  getCustomerByTaxQuery: (customerTax: string) =>
    db.query.customer.findFirst({
      where: (customer) => eq(customer.tax, customerTax),
    }),
  addCustomerQuery: async (newCustomer: Customer) => {
    const createdCustomer = await db
      .insert(customer)
      .values(newCustomer)
      .returning();

    return createdCustomer[0];
  },
  deleteCustomerQuery: async (customerID: number) => {
    if (!customerID || customerID < 1)
      throw new Error('CustomerID must be provided and higher than 0.');
    const deletedCustomer = await db
      .delete(customer)
      .where(eq(customer.id, customerID))
      .returning();

    return deletedCustomer[0];
  },
  updateCustomerQuery: async (
    customerID: number,
    newCustomerData: Partial<Customer>
  ) => {
    if (!customerID || customerID < 1)
      throw new Error('CustomerID must be provided and higher than 0.');
    const updatedCustomer = await db
      .update(customer)
      .set(newCustomerData)
      .where(eq(customer.id, customerID))
      .returning();

    return updatedCustomer[0];
  },
};
