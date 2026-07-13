import {
  InstagramIcon,
  FacebookIcon,
  TiktokIcon,
  YoutubeIcon,
} from "@/components/BrandIcons";

/**
 * Helper untuk bangun URL social media dari username.
 * Asumsi field di DB adalah username saja (tanpa @, tanpa URL).
 * Kalau user isi URL penuh, tetap coba extract username-nya.
 */
export function instagramUrl(handle: string | null | undefined): string | null {
  if (!handle) return null;
  const username = handle
    .replace(/^@/, "")
    .replace(/.*instagram\.com\//, "")
    .replace(/\/$/, "")
    .split("/")[0];
  return username ? `https://instagram.com/${username}` : null;
}

export function tiktokUrl(handle: string | null | undefined): string | null {
  if (!handle) return null;
  const username = handle
    .replace(/^@/, "")
    .replace(/.*tiktok\.com\/@?/, "")
    .replace(/\/$/, "")
    .split("/")[0];
  return username ? `https://tiktok.com/@${username}` : null;
}

export function facebookUrl(handle: string | null | undefined): string | null {
  if (!handle) return null;
  const username = handle
    .replace(/^@/, "")
    .replace(/.*facebook\.com\//, "")
    .replace(/\/$/, "")
    .split("/")[0];
  return username ? `https://facebook.com/${username}` : null;
}

export function youtubeUrl(handle: string | null | undefined): string | null {
  if (!handle) return null;
  const clean = handle
    .replace(/.*youtube\.com\/(channel\/|c\/|@)?/, "")
    .replace(/^@/, "")
    .replace(/\/$/, "")
    .split("/")[0];
  return clean ? `https://youtube.com/@${clean}` : null;
}

export type SocialKind = "instagram" | "tiktok" | "facebook" | "youtube";

export type SocialLink = {
  kind: SocialKind;
  url: string;
};

/**
 * Daftar social link siap render. Filter yang tidak punya handle.
 * Icon komponen dipisah (lihat BrandIcons) — function ini cuma return data
 * supaya reusable di server component juga.
 */
export function getSocialLinks(bisnis: {
  instagram?: string | null;
  tiktok?: string | null;
  facebook?: string | null;
  youtubeUrl?: string | null;
}): SocialLink[] {
  const out: SocialLink[] = [];
  const ig = instagramUrl(bisnis.instagram);
  if (ig) out.push({ kind: "instagram", url: ig });
  const tt = tiktokUrl(bisnis.tiktok);
  if (tt) out.push({ kind: "tiktok", url: tt });
  const fb = facebookUrl(bisnis.facebook);
  if (fb) out.push({ kind: "facebook", url: fb });
  const yt = youtubeUrl(bisnis.youtubeUrl);
  if (yt) out.push({ kind: "youtube", url: yt });
  return out;
}

export { InstagramIcon, FacebookIcon, TiktokIcon, YoutubeIcon };
