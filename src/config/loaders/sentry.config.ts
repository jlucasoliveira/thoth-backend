import { registerAs } from '@nestjs/config';

export const SentryConfigToken = 'sentry-config';

export type SentryConfig = {
  dsn: string;
  isEnabled: boolean;
};

export const sentryConfig = registerAs<SentryConfig>(SentryConfigToken, () => ({
  dsn: process.env.SENTRY_DSN,
  isEnabled: process.env.NODE_ENV === 'production',
}));
