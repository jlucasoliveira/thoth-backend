import { registerAs } from '@nestjs/config';
import { asInt } from './helpers';

export const ServerConfigToken = 'server-config';

export type ServerConfig = {
  nodeEnv: 'production' | 'development';
  publicUrl: string;
  port: number;
  globalPrefix?: string;
};

const nodeEnv = process.env.NODE_ENV as ServerConfig['nodeEnv'];

export const serverConfig = registerAs<ServerConfig>(ServerConfigToken, () => ({
  nodeEnv,
  publicUrl: process.env.PUBLIC_URL,
  port: asInt(process.env.PORT, 3000),
  globalPrefix: nodeEnv === 'development' ? '/api' : undefined,
}));
