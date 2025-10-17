import { AppError } from '@/lib/app-error';
import { accessSecret } from '@/lib/jwt';
import { RequestHandler } from 'express';
import * as jose from 'jose';

const verifyJWT: RequestHandler = async (req, res, next) => {
  try {
    const authHeaders = req.headers['authorization'];
    if (!authHeaders) {
      res.sendStatus(401);
      return;
    }

    const token = authHeaders.replace('Bearer ', '');

    await jose.jwtVerify(token, accessSecret);

    next();
  } catch (error) {
    next(new AppError(`Forbbiden: ${error}`, 403));
  }
};

export default verifyJWT;
