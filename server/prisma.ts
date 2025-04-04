import { PrismaClient } from '@prisma/client';

// Override the DATABASE_URL with our explicit URL
process.env.DATABASE_URL = "postgresql://neondb_owner:npg_TUnROa2X9IGB@ep-curly-hill-a5fifwhl.us-east-2.aws.neon.tech:5432/neondb";

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;