import 'reflect-metadata';
import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ProfilingIntegration } from '@sentry/profiling-node';
import * as Sentry from '@sentry/node';
import { Logger } from 'nestjs-pino';
import { GLOBAL_PREFIX, PORT, SENTRY_CONFIG } from '@/config/configuration';
import { SentryInterceptor } from '@/shared/interceptors/sentry.interceptor';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  Sentry.init({
    enabled: SENTRY_CONFIG.isEnabled,
    dsn: SENTRY_CONFIG.dsn,
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
      'UnauthorizedException',
    ],
  });

  app.useLogger(app.get(Logger));
  app.setGlobalPrefix(GLOBAL_PREFIX);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new SentryInterceptor());

  await app.listen(PORT);
}

bootstrap();
