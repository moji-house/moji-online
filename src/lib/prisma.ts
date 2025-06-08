import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

const globalForPrisma = globalThis;

const prisma = (globalForPrisma as { prisma?: PrismaClient }).prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
  (globalForPrisma as any).prisma = prisma;
}

export default prisma;