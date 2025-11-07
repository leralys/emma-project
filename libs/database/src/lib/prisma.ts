import { neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;

// Create a singleton instance
let prisma: PrismaClient;

function getPrismaClient(): PrismaClient {
  if (prisma) {
    return prisma;
  }

  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  const adapter = new PrismaNeon({ connectionString });
  prisma = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
  });

  return prisma;
}

// Export a lazy-initialized database client
export const db = new Proxy({} as PrismaClient, {
  get(target, prop: keyof PrismaClient) {
    const client = getPrismaClient();
    const value = client[prop];
    return typeof value === 'function' ? value.bind(client) : value;
  },
});
