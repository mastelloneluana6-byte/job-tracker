import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

/** Neon's `channel_binding=require` can break `pg` on some serverless hosts — strip it. */
function sanitizeDatabaseUrl(url: string) {
  try {
    const u = new URL(url);
    u.searchParams.delete("channel_binding");
    return u.toString();
  } catch {
    return url
      .replace(/([?&])channel_binding=[^&]*&?/g, "$1")
      .replace(/\?&/, "?")
      .replace(/[?&]$/, "");
  }
}

function getPool() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }
  const cleanUrl = sanitizeDatabaseUrl(connectionString);
  if (!globalForPrisma.pool) {
    const onVercel = process.env.VERCEL === "1";
    globalForPrisma.pool = new Pool({
      connectionString: cleanUrl,
      max: Number(process.env.PG_POOL_MAX ?? (onVercel ? 1 : 5)),
      idleTimeoutMillis: onVercel ? 10_000 : 20_000,
      connectionTimeoutMillis: 15_000,
      allowExitOnIdle: true,
    });
  }
  return globalForPrisma.pool;
}

function createPrismaClient() {
  const adapter = new PrismaPg(getPool());
  return new PrismaClient({ adapter });
}

export function getPrisma(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
  }
  return globalForPrisma.prisma;
}
