import { NextFunction, Request, Response } from 'express';
import { AppError } from '../lib/app-error';
import { ZodError } from 'zod';

export function error(
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  let errorMessage = err.message || 'An unknown error occured.';
  let errorCode = err.statusCode || 500;

  if (err instanceof ZodError) {
    errorMessage = JSON.parse(err.message);
    errorCode = 422;
  }

  res.status(errorCode).json({
    error: {
      message: errorMessage,
    },
  });
}
