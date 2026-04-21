import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";
import { Pool as PgPool } from "pg";
import { WebSocket } from "ws";

if (typeof globalThis.WebSocket === "undefined") {
  neonConfig.webSocketConstructor = WebSocket;
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pgPool: PgPool | undefined;
};

/** Neon's `channel_binding=require` can break some drivers — strip it. */
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

function isNeonHost(connectionString: string) {
  try {
    return new URL(connectionString).hostname.endsWith(".neon.tech");
  } catch {
    return connectionString.includes("neon.tech");
  }
}

function createPrismaClient() {
  const raw = process.env.DATABASE_URL;
  if (!raw) {
    throw new Error("DATABASE_URL is not set");
  }
  const connectionString = sanitizeDatabaseUrl(raw);

  // Neon on Vercel: TCP `pg` often fails — use WebSocket serverless driver + PrismaNeon.
  // Local / other Postgres: keep `pg` + PrismaPg.
  if (isNeonHost(connectionString)) {
    const adapter = new PrismaNeon({
      connectionString,
      max: Number(process.env.NEON_POOL_MAX ?? 1),
      allowExitOnIdle: true,
    });
    return new PrismaClient({ adapter });
  }

  if (!globalForPrisma.pgPool) {
    globalForPrisma.pgPool = new PgPool({
      connectionString,
      max: Number(process.env.PG_POOL_MAX ?? 5),
      idleTimeoutMillis: 20_000,
      connectionTimeoutMillis: 15_000,
      allowExitOnIdle: true,
    });
  }
  return new PrismaClient({
    adapter: new PrismaPg(globalForPrisma.pgPool),
  });
}

export function getPrisma(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
  }
  return globalForPrisma.prisma;
}
