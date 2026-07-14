import { JENIS_BISNIS, VIBE, type WizardInput } from '@/lib/schemas/wizard';

export type StepKey = 1 | 2 | 3 | 4 | 5;

export const STEP_LABELS: Record<StepKey, string> = {
  1: 'Bisnis',
  2: 'Kontak',
  3: 'Vibe',
  4: 'Layanan',
  5: 'Domain',
};

export const TOTAL_STEPS = 5;

export const JENIS_OPTIONS = JENIS_BISNIS;
export const VIBE_OPTIONS = VIBE;

export type VibeOption = (typeof VIBE)[number];

export const VIBE_DESCRIPTIONS: Record<VibeOption, { title: string; desc: string; emoji: string; fontClass: string }> = {
  casual: {
    title: 'Santai & Kekinian',
    desc: 'Cocok untuk kafe, laundry, barbershop. Pakai bahasa "kamu".',
    emoji: '☕',
    fontClass: 'font-casual',
  },
  professional: {
    title: 'Profesional & Tepercaya',
    desc: 'Cocok untuk bimbel, klinik, jasa. Pakai bahasa "Anda".',
    emoji: '💼',
    fontClass: 'font-professional',
  },
  elegant: {
    title: 'Elegan & Mewah',
    desc: 'Cocok untuk spa premium, butik, fine dining. Pakai font serif.',
    emoji: '✨',
    fontClass: 'font-elegant',
  },
  bold: {
    title: 'Bold & Energik',
    desc: 'Cocok untuk gym, barbershop modern, streetfood, creative agency.',
    emoji: '🔥',
    fontClass: 'font-casual',
  },
  minimal: {
    title: 'Minimal & Bersih',
    desc: 'Cocok untuk studio desain, freelancer, personal brand. Banyak white space.',
    emoji: '🌿',
    fontClass: 'font-professional',
  },
};

/**
 * Bangun URL tenant site dari subdomain.
 * - Production: https://kopisrawung.cus.site
 * - Local dev:   http://kopisrawung.localhost:3000
 */
export function buildTenantUrl(subdomain: string): string {
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'cus.site';
  const isLocal =
    process.env.NODE_ENV !== 'production' ||
    rootDomain.endsWith('.localhost');

  if (isLocal) {
    const port = typeof window !== 'undefined' && window.location.port
      ? `:${window.location.port}`
      : '';
    return `http://${subdomain}.localhost${port}`;
  }

  return `https://${subdomain}.${rootDomain}`;
}

export type SubmitState =
  | { status: 'idle' }
  | { status: 'submitting' }
  | { status: 'success'; subdomain: string; url: string; accessLink: string }
  | { status: 'error'; message: string };

export type { WizardInput };
