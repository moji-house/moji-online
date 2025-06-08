import { PrismaClient } from '@prisma/client';

// ป้องกันการสร้าง PrismaClient หลายตัวในโหมด development
const globalForPrisma = global;

export const db = 
  (globalForPrisma as any).prisma || 
  new PrismaClient({
    log: ['query'],
  });

if (process.env.NODE_ENV !== 'production') (globalForPrisma as any).prisma = db;