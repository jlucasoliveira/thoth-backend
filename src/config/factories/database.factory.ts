import { DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import {
  DatabaseConfig,
  DatabaseConfigToken,
  ServerConfig,
  ServerConfigToken,
} from '@/config';

export function databaseFactory(
  configService: ConfigService,
): DataSourceOptions {
  const { nodeEnv } = configService.getOrThrow<ServerConfig>(ServerConfigToken);
  const config = configService.getOrThrow<DatabaseConfig>(DatabaseConfigToken);

  const data: DataSourceOptions = {
    type: 'oracle',
    username: config.username,
    password: config.password,
    connectString: config.connectString,
    synchronize: false,
    logging: config.isDebug ? 'all' : false,
    logger: config.isDebug ? 'file' : 'advanced-console',
    entities: [config.entitiesPath],
    migrations: [config.migrationsPath],
    migrationsRun: nodeEnv === 'production',
    useUTC: true,
    extra: {
      walletLocation: config.walletPath,
      walletPassword: config.walletPassword,
      configDir: config.walletPath,
    },
  };

  console.log(data);

  return data;
}
