import 'reflect-metadata';
import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ProfilingIntegration } from '@sentry/profiling-node';
import * as Sentry from '@sentry/node';
import { Logger } from 'nestjs-pino';
import { DatabaseInterceptor, SentryInterceptor } from '@/shared/interceptors';
import {
  SentryConfig,
  SentryConfigToken,
  ServerConfig,
  ServerConfigToken,
} from '@/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  const configService = app.get(ConfigService);
  const { port, globalPrefix } =
    configService.getOrThrow<ServerConfig>(ServerConfigToken);
  const { dsn, isEnabled } =
    configService.getOrThrow<SentryConfig>(SentryConfigToken);

  Sentry.init({
    enabled: isEnabled,
    dsn: dsn,
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Sentry.Integrations.Express({ app: app.getHttpServer() }),
      new ProfilingIntegration(),
    ],
    tracesSampleRate: 1.0,
    profilesSampleRate: 1.0,
    ignoreErrors: [
      'NotFoundException',
      'BadRequestException',
      'BadGatewayException',
      'UnauthorizedException',
    ],
  });

  app.useLogger(app.get(Logger));

  if (globalPrefix) app.setGlobalPrefix(globalPrefix);
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new DatabaseInterceptor(), new SentryInterceptor());

  await app.listen(port);
}

bootstrap();
