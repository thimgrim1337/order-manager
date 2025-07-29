import RequestValidators from '../interfaces/RequestValidators';
import { RequestHandler } from 'express';

export function validateRequest(validators: RequestValidators): RequestHandler {
  return async (req, res, next) => {
    try {
      if (validators.params) {
        (req as any).params = await validators.params.parseAsync(req.params);
      }
      if (validators.body) {
        (req as any).body = await validators.body.parseAsync(req.body);
      }
      if (validators.query) {
        (req as any).query = await validators.query.parseAsync(req.query);
      }
      next();
    } catch (error) {
      next(error);
    }
  };
}
