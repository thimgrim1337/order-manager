import { RequestHandler } from 'express';
import { orderServices } from './orders.sevices';
import { AppError } from '@/lib/app-error';
import { Order, OrderWithId } from './orders.model';
import { ParamsWithId } from '@/interfaces/ParamsWithId';
import * as loadingPlacesHandler from '@/api/loadingPlaces/loading-places.handlers';
import * as unloadingPlacesHandler from '@/api/unloadingPlaces/unloading-places.handlers';

export const getAllOrders: RequestHandler<{}, OrderWithId[]> = async (
  req,
  res,
  next
) => {
  try {
    const orders = await orderServices.getOrdersQuery();
    res.status(200).send(orders);
  } catch (error) {
    next(new AppError('Failed to fetch orders', 500));
  }
};

export const getOrderById: RequestHandler<
  ParamsWithId,
  OrderWithId | {}
> = async (req, res, next) => {
  try {
    const order = await orderServices.getOrderByIdQuery(+req.params.id);

    if (!order) res.status(404).send({});

    await loadingPlacesHandler.getAllLoadingPlacesByOrderId(+req.params.id);

    res.status(200).send(order);
  } catch (error) {
    next(new AppError('Failed to fetch order', 500));
  }
};

export const addOrder: RequestHandler<{}, OrderWithId, Order> = async (
  req,
  res,
  next
) => {
  try {
    const { orderNr, customerID } = req.body;

    const existingOrder = await orderServices.getOrderByNrAndCustomerQuery(
      orderNr,
      customerID
    );
    if (existingOrder) throw new AppError('Order already exist.', 409);

    const newOrder = req.body;

    const createdOrder = await orderServices.addOrderQuery(newOrder);

    if (createdOrder[0]) {
      await loadingPlacesHandler.addLoadingPlaces(
        createdOrder[0].id,
        req.body.loadingPlaces
      );
      await unloadingPlacesHandler.addUnloadingPlaces(
        createdOrder[0].id,
        req.body.unloadingPlaces
      );
    }

    res.status(201).json(createdOrder[0]);
  } catch (error) {
    next(error);
  }
};

export const updateOrder: RequestHandler<
  ParamsWithId,
  OrderWithId,
  Order
> = async (req, res, next) => {
  try {
    const orderID = +req.params.id;

    const existingOrder = await orderServices.getOrderByIdQuery(orderID);
    if (!existingOrder) throw new AppError('Order does not exist', 404);

    const updatedOrderObj = req.body;

    const updatedOrder = await orderServices.updateOrderQuery(
      orderID,
      updatedOrderObj
    );

    await loadingPlacesHandler.updateLoadingPlaces(
      orderID,
      updatedOrderObj.loadingPlaces
    );

    await unloadingPlacesHandler.updateUnloadingPlaces(
      orderID,
      updatedOrderObj.unloadingPlaces
    );

    res.status(200).json(updatedOrder[0]);
  } catch (error) {
    next(error);
  }
};

export const deleteOrder: RequestHandler<ParamsWithId, OrderWithId> = async (
  req,
  res,
  next
) => {
  try {
    const orderID = +req.params.id;
    const orderExist = await orderServices.getOrderByIdQuery(orderID);

    if (!orderExist) throw new AppError('Order does not exist.', 404);

    await loadingPlacesHandler.deleteLoadingPlaces(orderID);
    await unloadingPlacesHandler.deleteUnloadingPlaces(orderID);
    const deletedOrder = await orderServices.deleteOrderQuery(orderID);

    res.status(200).json(deletedOrder[0]);
  } catch (error) {
    next(error);
  }
};
