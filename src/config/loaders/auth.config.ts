import { registerAs } from '@nestjs/config';

export const AuthConfigToken = 'auth-config';

export type AuthConfig = {
  secret: string;
  expiresIn: string | number;
};

export const authConfig = registerAs<AuthConfig>(AuthConfigToken, () => ({
  secret: process.env.JWT_SECRET,
  expiresIn: process.env.JWT_EXPIRE_IN ?? '30d',
}));
