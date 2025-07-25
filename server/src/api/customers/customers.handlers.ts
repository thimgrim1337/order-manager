import { RequestHandler } from 'express';
import { AppError } from '@/lib/app-error';
import { customerServices } from './customers.services';
import { Customer, CustomerWithId } from './customers.model';
import { ParamsWithId } from '@/interfaces/ParamsWithId';

export const getAllCustomers: RequestHandler = async (req, res, next) => {
  try {
    const customers = await customerServices.getCustomersQuery();
    res.status(200).send(customers);
  } catch (error) {
    next(new AppError('Failed to fetch customers: ' + error, 500));
  }
};

export const getCustomerById: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params as ParamsWithId;
    const customer = await customerServices.getCustomerByIdQuery(+id);

    if (!customer) throw new AppError('Customer does not exist', 404);

    res.status(200).json(customer);
  } catch (error) {
    next(error);
  }
};

export const createCustomer: RequestHandler = async (req, res, next) => {
  try {
    const { tax } = req.body as Customer;

    const existingCustomer = await customerServices.getCustomerByTaxQuery(tax);

    if (existingCustomer) {
      throw new AppError('Customer already exist.', 409);
    }

    const createdCustomer = await customerServices.addCustomerQuery(req.body);

    res.status(201).json(createdCustomer);
  } catch (error) {
    next(error);
  }
};

export const updateCustomer: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params as ParamsWithId;

    const existingCustomer = await customerServices.getCustomerByIdQuery(+id);

    if (!existingCustomer) throw new AppError('Customer does not exist', 404);

    const updatedCustomer = await customerServices.updateCustomerQuery(
      existingCustomer.id,
      req.body
    );

    res.status(200).json(updatedCustomer);
  } catch (error) {
    next(error);
  }
};

export const deleteCustomer: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params as ParamsWithId;

    //TODO: Usuwanie kontrahenta narusza klucz podstawowy order_customer

    const existingCustomer = await customerServices.getCustomerByIdQuery(+id);

    if (!existingCustomer) throw new AppError('Customer does not exist', 404);

    const deletedCustomer = await customerServices.deleteCustomerQuery(+id);

    res.status(200).json(deletedCustomer);
  } catch (error) {
    next(error);
  }
};
