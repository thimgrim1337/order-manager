import { RequestHandler } from 'express';
import { orderServices } from './orders.sevices';
import { AppError } from '@/lib/app-error';
import { Order, OrderWithId, OrderWithIdAndDetails } from './orders.model';
import { ParamsWithId } from '@/interfaces/ParamsWithId';
import * as loadingPlacesHandler from '@/api/loadingPlaces/loading-places.handlers';
import * as unloadingPlacesHandler from '@/api/unloadingPlaces/unloading-places.handlers';
import getCitiesId from '../cities/helpers/getCitiesId';

export const getAllOrders: RequestHandler<{}, OrderWithIdAndDetails[]> = async (
  req,
  res,
  next
) => {
  try {
    const orders = await orderServices.getOrdersQuery();

    const mapped = orders.map((order) => ({
      ...order,
      loadingPlaces: order.loadingPlaces.map((loadingPlace) => ({
        ...loadingPlace.place,
      })),
      unloadingPlaces: order.unloadingPlaces.map((unloadingPlace) => ({
        ...unloadingPlace.place,
      })),
    }));

    res.status(200).json(mapped);
  } catch (error) {
    next(new AppError('Failed to fetch orders', 500));
  }
};

export const getOrderById: RequestHandler<
  ParamsWithId,
  OrderWithIdAndDetails | {}
> = async (req, res, next) => {
  try {
    const order = await orderServices.getOrderByIdQuery(+req.params.id);

    if (!order) res.status(404).send({});

    const mapped = {
      ...order,
      loadingPlaces: order?.loadingPlaces.map((place) => ({ ...place.place })),
      unloadingPlaces: order?.unloadingPlaces.map((place) => ({
        ...place.place,
      })),
    };

    res.status(200).json(mapped);
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
    const { orderNr, customerID, loadingPlaces, unloadingPlaces } = req.body;

    const existingOrder = await orderServices.getOrderByNrAndCustomerQuery(
      orderNr,
      customerID
    );
    if (existingOrder) throw new AppError('Order already exist.', 409);

    const newOrder = req.body;

    const createdOrder = await orderServices.addOrderQuery(newOrder);
    if (!createdOrder) throw new AppError('Failed to create order', 500);

    const loadingPlacesIds = (await getCitiesId(loadingPlaces)) as number[];
    const unloadingPlacesIds = (await getCitiesId(unloadingPlaces)) as number[];

    if (createdOrder[0]) {
      await loadingPlacesHandler.addLoadingPlaces(
        createdOrder[0].id,
        loadingPlacesIds
      );
      await unloadingPlacesHandler.addUnloadingPlaces(
        createdOrder[0].id,
        unloadingPlacesIds
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

    const loadingPlacesIds = (await getCitiesId(
      updatedOrderObj.loadingPlaces
    )) as number[];
    const unloadingPlacesIds = (await getCitiesId(
      updatedOrderObj.unloadingPlaces
    )) as number[];

    await loadingPlacesHandler.updateLoadingPlaces(orderID, loadingPlacesIds);

    await unloadingPlacesHandler.updateUnloadingPlaces(
      orderID,
      unloadingPlacesIds
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
