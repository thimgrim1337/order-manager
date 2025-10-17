import { RequestHandler } from 'express';
import { AppError } from '@/lib/app-error';
import bcrypt from 'bcrypt';
import * as jose from 'jose';
import { accessSecret, refreshSecret } from '@/lib/jwt';
import { userServices } from '@/api/users/users.services';
import { User } from '@/api/users/users.model';

export const handleLogin: RequestHandler = async (req, res, next) => {
  try {
    const { username, password } = req.body as User;

    const user = await userServices.getUserByUsernameQuery(username);

    if (!user) throw new AppError('User does not exist.', 401);

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const alg = 'HS256';
      const accessToken = await new jose.SignJWT({ username: user.username })
        .setProtectedHeader({ alg })
        .setExpirationTime('30s')
        .sign(accessSecret);

      const refreshToken = await new jose.SignJWT()
        .setProtectedHeader({ alg })
        .setExpirationTime('1d')
        .sign(refreshSecret);

      await userServices.updateUserQuery(user.id, { token: refreshToken });

      res.cookie('jwt', refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.json({ accessToken });
    } else {
      res.sendStatus(401);
      return;
    }
  } catch (error) {
    next(error);
  }
};

export const handleLogout: RequestHandler = async (req, res, next) => {
  try {
    const cookies = req.cookies;

    if (!cookies?.jwt) {
      res.sendStatus(204);
      return;
    }
    const refreshToken = cookies.jwt;

    const user = await userServices.getUsersRefreshToken(refreshToken);
    if (!user) {
      res.clearCookie('jwt', { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
      res.sendStatus(204);
      return;
    }

    userServices.updateUserQuery(user.id, { token: null });
    res.clearCookie('jwt', { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};
