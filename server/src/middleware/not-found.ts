import { Request, Response, NextFunction } from 'express';
import { AppError } from '../lib/app-error';

export function notFound(req: Request, res: Response, next: NextFunction) {
  return next(new AppError('Route not found', 404));
}
