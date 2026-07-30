import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Lazy singletons — tidak diinisiasi saat module di-import,
// hanya saat pertama kali limit() dipanggil. Ini mencegah build failure
// ketika UPSTASH env vars belum di-set di Vercel.
let _redis: Redis | undefined;
let _loginRl: Ratelimit | undefined;
let _verifyRl: Ratelimit | undefined;
let _uploadRl: Ratelimit | undefined;
let _aiRl: Ratelimit | undefined;
let _trackRl: Ratelimit | undefined;

const REDIS_CONFIGURED =
  !!process.env.UPSTASH_REDIS_REST_URL &&
  !!process.env.UPSTASH_REDIS_REST_TOKEN;

// Kalau Redis belum dikonfigurasi (dev lokal), bypass rate limit
const BYPASS_RESULT = { success: true, limit: 999, remaining: 998, reset: 0 };

// Di production, bypass diam-diam berbahaya (env UPSTASH lupa di-set = rate limit mati tanpa jejak)
if (!REDIS_CONFIGURED && process.env.NODE_ENV === "production") {
  console.warn(
    "[ratelimit] UPSTASH_REDIS_REST_URL/TOKEN belum di-set — rate limiting NONAKTIF di production.",
  );
}

function getRedis(): Redis {
  if (!REDIS_CONFIGURED) throw new Error("Redis not configured");
  return (_redis ??= new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  }));
}

/** 3 magic link per 15 menit per email */
export const loginRatelimit = {
  limit: (id: string) =>
    !REDIS_CONFIGURED
      ? Promise.resolve(BYPASS_RESULT)
      : (_loginRl ??= new Ratelimit({
          redis: getRedis(),
          limiter: Ratelimit.slidingWindow(3, "15 m"),
          prefix: "rl:login",
        })).limit(id),
};

/** 10 verify attempt per menit per IP */
export const verifyRatelimit = {
  limit: (id: string) =>
    !REDIS_CONFIGURED
      ? Promise.resolve(BYPASS_RESULT)
      : (_verifyRl ??= new Ratelimit({
          redis: getRedis(),
          limiter: Ratelimit.slidingWindow(10, "1 m"),
          prefix: "rl:verify",
        })).limit(id),
};

/** 10 upload per menit per IP */
export const uploadRatelimit = {
  limit: (id: string) =>
    !REDIS_CONFIGURED
      ? Promise.resolve(BYPASS_RESULT)
      : (_uploadRl ??= new Ratelimit({
          redis: getRedis(),
          limiter: Ratelimit.slidingWindow(10, "1 m"),
          prefix: "rl:upload",
        })).limit(id),
};

/**
 * 60 page view per menit per IP. /api/track itu public tanpa auth — tanpa ini
 * siapa pun bisa loop POST dan numpuk row analytics tanpa batas.
 *
 * ponytail: per-IP, dan IP operator seluler itu NAT (banyak pengunjung, satu IP).
 * 60/menit jauh di atas trafik wajar UMKM, tapi kalau ada tenant yang ramai,
 * ini angka pertama yang perlu dinaikin — atau ganti key-nya jadi IP+bisnisId.
 */
export const trackRatelimit = {
  limit: (id: string) =>
    !REDIS_CONFIGURED
      ? Promise.resolve(BYPASS_RESULT)
      : (_trackRl ??= new Ratelimit({
          redis: getRedis(),
          limiter: Ratelimit.slidingWindow(60, "1 m"),
          prefix: "rl:track",
        })).limit(id),
};

/** 5 AI generation per jam per identifier (email atau IP) */
export const aiRatelimit = {
  limit: (id: string) =>
    !REDIS_CONFIGURED
      ? Promise.resolve(BYPASS_RESULT)
      : (_aiRl ??= new Ratelimit({
          redis: getRedis(),
          limiter: Ratelimit.slidingWindow(5, "1 h"),
          prefix: "rl:ai",
        })).limit(id),
};
