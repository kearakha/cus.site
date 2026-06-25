import { PrismaClient } from "@prisma/client";
import { unstable_cache } from "next/cache";

/**
 * Prisma Client Singleton
 *
 * Di dev mode, Next.js hot reload bisa bikin banyak instance PrismaClient
 * yang akhirnya habisin connection pool. Pattern ini simpan instance di
 * globalThis supaya re-used across reloads.
 *
 * Di production (Vercel serverless), setiap cold start bikin instance baru —
 * tapi itu aman karena langsung di-GC setelah request selesai.
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

/**
 * Helper: cari Bisnis + KontenWebsite + Layanan sekaligus.
 * Dipakai di tenant page supaya 1 query aja (avoid N+1).
 */
export function getBisnisBySubdomain(subdomain: string) {
  return unstable_cache(
    () =>
      prisma.bisnis.findUnique({
        where: { subdomain },
        include: {
          kontenAI: true,
          layanan: { orderBy: { order: "asc" } },
        },
      }),
    [`bisnis-${subdomain}`],
    { revalidate: 60, tags: [`bisnis-${subdomain}`] },
  )();
}
