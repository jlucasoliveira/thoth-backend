export function asInt(value?: string, defaultValue?: number): number {
  if (value === undefined && defaultValue === undefined)
    throw new Error(`You must provide a valid value or a valid default value`);

  const parsed = parseInt(value, 10);

  if (isNaN(parsed)) return defaultValue;

  return parsed;
}
