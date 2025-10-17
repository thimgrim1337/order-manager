import { ParamsWithId } from '@/interfaces/ParamsWithId';
import { RequestHandler } from 'express';
import { userServices } from './users.services';
import { AppError } from '@/lib/app-error';
import { User } from './users.model';
import bcrypt from 'bcrypt';

export const getAllUsers: RequestHandler = async (req, res, next) => {
  try {
    const users = await userServices.getAllUsersQuery();

    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const getUserById: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params as ParamsWithId;
    const existingUser = await userServices.getUserByIdQuery(+id);

    if (!existingUser) throw new AppError('User doest not exist', 404);

    res.status(200).json(existingUser);
  } catch (error) {
    next(error);
  }
};

export const createUser: RequestHandler = async (req, res, next) => {
  try {
    const { username, password } = req.body as User;

    const existingUser = await userServices.getUserByUsernameQuery(username);
    if (existingUser) throw new AppError('Username already exist.', 409);

    const hashedPassword = await bcrypt.hash(password, 10);

    const createdUser = await userServices.createUserQuery({
      username,
      password: hashedPassword,
    });

    res.status(201).json(createdUser);
  } catch (error) {
    next(error);
  }
};
