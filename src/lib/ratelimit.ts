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

function getRedis(): Redis {
  return (_redis ??= new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  }));
}

/** 3 magic link per 15 menit per email */
export const loginRatelimit = {
  limit: (id: string) =>
    (_loginRl ??= new Ratelimit({
      redis: getRedis(),
      limiter: Ratelimit.slidingWindow(3, "15 m"),
      prefix: "rl:login",
    })).limit(id),
};

/** 10 verify attempt per menit per IP */
export const verifyRatelimit = {
  limit: (id: string) =>
    (_verifyRl ??= new Ratelimit({
      redis: getRedis(),
      limiter: Ratelimit.slidingWindow(10, "1 m"),
      prefix: "rl:verify",
    })).limit(id),
};

/** 10 upload per menit per IP */
export const uploadRatelimit = {
  limit: (id: string) =>
    (_uploadRl ??= new Ratelimit({
      redis: getRedis(),
      limiter: Ratelimit.slidingWindow(10, "1 m"),
      prefix: "rl:upload",
    })).limit(id),
};

/** 5 AI generation per jam per identifier (email atau IP) */
export const aiRatelimit = {
  limit: (id: string) =>
    (_aiRl ??= new Ratelimit({
      redis: getRedis(),
      limiter: Ratelimit.slidingWindow(5, "1 h"),
      prefix: "rl:ai",
    })).limit(id),
};
