import { RequestHandler } from 'express';
import { userServices } from '../../users/users.services';
import { AppError } from '@/lib/app-error';
import * as jose from 'jose';
import { accessSecret, refreshSecret } from '@/lib/jwt';

export const handleRefreshToken: RequestHandler = async (req, res, next) => {
  try {
    const cookies = req.cookies;

    if (!cookies?.jwt) {
      res.sendStatus(401);
      return;
    }
    const refreshToken = cookies.jwt;

    const user = await userServices.getUsersRefreshToken(refreshToken);

    if (!user) {
      res.sendStatus(403);
      return;
    }

    await jose.jwtVerify(refreshToken, refreshSecret);

    const alg = 'HS256';
    const accessToken = await new jose.SignJWT({ username: user.username })
      .setProtectedHeader({ alg })
      .setExpirationTime('30s')
      .sign(accessSecret);

    res.status(200).json({ accessToken });
  } catch (error) {
    next(new AppError(`Forbbiden: ${error}`, 403));
  }
};
