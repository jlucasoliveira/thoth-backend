import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ProfilingIntegration } from '@sentry/profiling-node';
import * as Sentry from '@sentry/node';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Sentry.Integrations.Express({ app: app.getHttpServer() }),
      new ProfilingIntegration(),
    ],
    tracesSampleRate: 1.0,
    profilesSampleRate: 1.0,
  });

  await app.listen(3000);
}
bootstrap();
