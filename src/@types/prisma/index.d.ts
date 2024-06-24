import { PrismaClient } from '@prisma/client';
import { ITXClientDenyList } from '@prisma/client/runtime/library';

export type Transaction = Omit<PrismaClient, ITXClientDenyList>;

export type BaseEntity = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
};
