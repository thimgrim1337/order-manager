import { RequestHandler } from 'express';
import { orderServices } from './orders.sevices';
import { AppError } from '@/lib/app-error';
import {
  OrderFilters,
  OrderWithIdAndPlaces,
  OrderWithPlaces,
} from './orders.model';
import getCitiesIds from '../cities/helpers/getCitiesId';
import { ParamsWithId } from '@/interfaces/ParamsWithId';
import * as placesHandler from '@/api/places/places.handlers';
import db from '@/db';

export const getFilterdOrders: RequestHandler = async (req, res, next) => {
  try {
    const { pageIndex, pageSize, sortBy, ...filters } =
      req.query as unknown as OrderFilters;

    const orders = await orderServices.getOrdersQuery(
      pageIndex,
      pageSize,
      sortBy,
      filters
    );

    const orderCount = await orderServices.getOrderCount();

    res.status(200).json({
      data: [...orders],
      rowCount: orderCount[0]?.count ?? 0,
    });
  } catch (error) {
    next(new AppError('Failed to fetch orders: ' + error, 500));
  }
};

export const getOrderById: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params as ParamsWithId;
    const order = await orderServices.getOrderByIdQuery(+id);

    if (!order) throw new AppError('Order does not exist.', 404);

    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

export const createOrder: RequestHandler = async (req, res, next) => {
  try {
    const { orderNr, customerID, loadingPlaces, unloadingPlaces } =
      req.body as OrderWithPlaces;

    const existingOrder = await orderServices.getOrderByNrAndCustomerQuery(
      orderNr,
      customerID
    );
    if (existingOrder) throw new AppError('Order already exist.', 409);

    const loadingPlacesIds = await getCitiesIds(loadingPlaces);
    const unloadingPlacesIds = await getCitiesIds(unloadingPlaces);

    if (!loadingPlacesIds.length || !unloadingPlacesIds.length)
      throw new AppError('Invalid places provided', 400);

    const createdOrder = await db.transaction(async (trx) => {
      const order = await orderServices.createOrderQuery(req.body, trx);

      await placesHandler.addPlaces(
        order?.id,
        loadingPlacesIds,
        'loadingPlace',
        trx
      );
      await placesHandler.addPlaces(
        order.id,
        unloadingPlacesIds,
        'unloadingPlace',
        trx
      );

      return order;
    });

    res.status(201).json(createdOrder);
  } catch (error) {
    next(error);
  }
};

export const updateOrder: RequestHandler = async (req, res, next) => {
  try {
    const { id, loadingPlaces, unloadingPlaces } =
      req.body as OrderWithIdAndPlaces;

    const existingOrder = await orderServices.getOrderByIdQuery(id);

    if (!existingOrder) throw new AppError('Order does not exist.', 404);

    const loadingPlacesIds = await getCitiesIds(loadingPlaces);
    const unloadingPlacesIds = await getCitiesIds(unloadingPlaces);

    if (!loadingPlacesIds.length || !unloadingPlacesIds.length)
      throw new AppError('Invalid places provided', 400);

    const updatedOrder = await db.transaction(async (trx) => {
      const order = await orderServices.updateOrderQuery(
        existingOrder.id,
        req.body,
        trx
      );

      await placesHandler.updatePlaces(
        existingOrder.id,
        'loadingPlace',
        loadingPlacesIds,
        trx
      );

      await placesHandler.updatePlaces(
        existingOrder.id,
        'unloadingPlace',
        unloadingPlacesIds,
        trx
      );

      return order;
    });
    res.status(200).json(updatedOrder);
  } catch (error) {
    next(error);
  }
};

export const deleteOrder: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params as ParamsWithId;
    const existingOrder = await orderServices.getOrderByIdQuery(+id);

    if (!existingOrder) throw new AppError('Order doest not exist.', 404);

    const deletedOrder = await db.transaction(async (trx) => {
      await placesHandler.removePlaces(existingOrder.id, 'loadingPlace', trx);
      await placesHandler.removePlaces(existingOrder.id, 'unloadingPlace', trx);
      const order = await orderServices.deleteOrderQuery(existingOrder.id, trx);

      return order;
    });

    res.status(200).json(deletedOrder);
  } catch (error) {
    next(new AppError('Failed to delete an order: ' + error, 500));
  }
};
