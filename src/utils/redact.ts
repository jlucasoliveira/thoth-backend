import fastRedact from 'fast-redact';

export const redact = fastRedact({
  strict: false,
  paths: [
    'password',
    'accessToken',
    'authorization',
    'Authorization',
    '["x-forwarded-for"]',
    '["x-real-ip"]',
  ],
});

export function redactObject(obj: Record<string, any>): Record<string, any> {
  const redacted = redact(obj);

  if (typeof redacted === 'string') return JSON.parse(redacted);

  return redacted;
}
