/* https://www.prisma.io/docs/orm/prisma-client/queries/excluding-fields */
export function exclude<Entity, Key extends keyof Entity>(
  obj: Entity,
  keys: Key[],
): Omit<Entity, Key> {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => !keys.includes(key as Key)),
  ) as Omit<Entity, Key>;
}
