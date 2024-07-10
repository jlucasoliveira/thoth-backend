import { ConfigService } from '@nestjs/config';
import { ServerConfig, ServerConfigToken } from '@/config';

export function loggerFactory(configService: ConfigService) {
  const { nodeEnv } = configService.get<ServerConfig>(ServerConfigToken);

  return {
    pinoHttp: {
      level: nodeEnv === 'production' ? 'info' : 'debug',
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'UTC:dd/mm/yy HH:MM:ss',
          ignore: 'pid,hostname',
          singleLine: true,
        },
      },
    },
  };
}
