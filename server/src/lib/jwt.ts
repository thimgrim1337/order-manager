import { createSecretKey } from 'crypto';

export const accessSecret = createSecretKey(
  process.env.ACCESS_TOKEN_SECRET!,
  'utf8'
);
export const refreshSecret = createSecretKey(
  process.env.REFRESH_TOKEN_SECRET!,
  'utf-8'
);
