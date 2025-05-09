import { RequestHandler } from 'express';
import { AppError } from '@/lib/app-error';
import { customerServices } from './customers.services';
import { CustomerWithId } from './customers.model';
import { ParamsWithId } from '@/interfaces/ParamsWithId';
import * as addressHandlers from '../addresses/addresses.handlers';

export const getAllCustomers: RequestHandler<{}, CustomerWithId[]> = async (
  req,
  res,
  next
) => {
  try {
    const customers = await customerServices.getCustomersQuery();
    res.status(200).send(customers);
  } catch (error) {
    next(new AppError('Failed to fetch customers', 500));
  }
};

export const getCustomerById: RequestHandler<
  ParamsWithId,
  CustomerWithId | {}
> = async (req, res, next) => {
  try {
    const customer = await customerServices.getCustomerByIdQuery(
      +req.params.id
    );

    if (!customer) res.status(404).send({});

    res.status(200).json(customer);
  } catch (error) {
    next(new AppError('Failed to fetch customer', 500));
  }
};

export const addCustomer: RequestHandler<
  {},
  CustomerWithId,
  CustomerWithId
> = async (req, res, next) => {
  try {
    const { id, name, tax } = req.body;

    const existingCustomer = await customerServices.getCustomerByTaxQuery(tax);
    if (existingCustomer) {
      throw new AppError('Customer already exist.', 409);
    }

    const newCustomer = {
      id,
      name,
      tax,
    };

    const createdCustomer = await customerServices.addCustomerQuery(
      newCustomer
    );

    res.status(201).json(createdCustomer[0]);
  } catch (error) {
    next(error);
  }
};

export const updateCustomer: RequestHandler<
  ParamsWithId,
  CustomerWithId,
  CustomerWithId
> = async (req, res, next) => {
  try {
    const customerID = +req.params.id;
    const { tax, name } = req.body;

    const existingCustomer = await customerServices.getCustomerByIdQuery(
      customerID
    );
    if (!existingCustomer) throw new AppError('Customer does not exist', 404);

    const updatedCustomerObj = {
      tax,
      name,
    };

    const updatedCustomer = await customerServices.updateCustomerQuery(
      updatedCustomerObj,
      customerID
    );
    res.status(200).json(updatedCustomer[0]);
  } catch (error) {
    next(error);
  }
};

export const deleteCustomer: RequestHandler<
  ParamsWithId,
  CustomerWithId
> = async (req, res, next) => {
  try {
    const deletedCustomer = await customerServices.deleteCustomerQuery(
      +req.params.id
    );

    if (!deletedCustomer.length) {
      throw new AppError('Customer does not exist.', 404);
    }

    if (!deletedCustomer[0])
      throw new AppError('Something went wrong when deleting customer.', 404);

    res.status(200).json(deletedCustomer[0]);
  } catch (error) {
    next(error);
  }
};
