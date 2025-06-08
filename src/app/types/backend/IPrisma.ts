// Utility type for Prisma transaction client
import { PrismaClient } from '@prisma/client';

export type PrismaTransactionalClient = Omit<
  PrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>;