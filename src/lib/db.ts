import { Pool } from "pg";

const globalForDb = globalThis as typeof globalThis & {
  __runpsyPool__?: Pool;
};

export function getDbPool() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    return null;
  }

  if (!globalForDb.__runpsyPool__) {
    globalForDb.__runpsyPool__ = new Pool({
      connectionString,
      max: 5,
    });
  }

  return globalForDb.__runpsyPool__;
}

