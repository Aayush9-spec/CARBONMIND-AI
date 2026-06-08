// =============================================================================
// CARBONMIND AI — Prisma Client Singleton (Prisma 7 with pg Driver Adapter)
// =============================================================================
// Prevents multiple PrismaClient instances during Next.js hot reloading.
// Uses PostgreSQL driver adapter as required by Prisma 7.
// =============================================================================

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

let prismaClient: PrismaClient;

if (globalForPrisma.prisma) {
  prismaClient = globalForPrisma.prisma;
} else {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    // Graceful fallback for builds or config steps where database is not yet connected
    // This allows next.js to compile pages without failing at build-time.
    prismaClient = new PrismaClient();
  } else {
    const pool = new pg.Pool({ connectionString });
    const adapter = new PrismaPg(pool);

    prismaClient = new PrismaClient({
      adapter,
      log:
        process.env.NODE_ENV === 'development'
          ? ['query', 'error', 'warn']
          : ['error'],
    });
  }

  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prismaClient;
  }
}

export const prisma = prismaClient;
export default prisma;
