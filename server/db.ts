// This file is kept for compatibility, but we're now using Prisma
// The actual Prisma client is exported from server/prisma.ts

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Re-export prisma from prisma.ts for backward compatibility
export { prisma as db } from './prisma';
