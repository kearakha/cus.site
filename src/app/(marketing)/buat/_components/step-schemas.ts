/**
 * Re-export step schemas + types dari wizard schema,
 * plus type aliases `Step1`, `Step2`, dll supaya import di component
 * lebih pendek dan lebih scoped.
 */
import {
  step1Schema,
  step2Schema,
  step3Schema,
  step4Schema,
  step5Schema,
  JENIS_BISNIS,
  HARI_OPERASIONAL,
  layananItemSchema,
  type LayananItem,
} from '@/lib/schemas/wizard';

export {
  step1Schema,
  step2Schema,
  step3Schema,
  step4Schema,
  step5Schema,
  JENIS_BISNIS as JENIS_OPTIONS,
  HARI_OPERASIONAL as HARI_OPERASIONAL_OPTIONS,
  layananItemSchema,
  LayananItem,
};

export type Step1 = {
  namaBisnis: string;
  jenisBisnis: (typeof JENIS_BISNIS)[number];
  logoUrl?: string;
  coverUrl?: string;
};

export type Step2 = {
  lokasi: string;
  whatsapp: string;
  email: string;
  instagram?: string;
  tiktok?: string;
  facebook?: string;
  jamBuka?: string;
  jamTutup?: string;
  hariOperasional?: (typeof HARI_OPERASIONAL)[number] | '';
};

export type Step3 = {
  vibe: 'casual' | 'professional' | 'elegant' | 'bold' | 'minimal';
};

export type Step4 = {
  layanan: Array<{
    title: string;
    description: string;
    imageUrl?: string;
  }>;
};
