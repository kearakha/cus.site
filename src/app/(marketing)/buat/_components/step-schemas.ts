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
  layananItemSchema,
  LayananItem,
};

export type Step1 = {
  namaBisnis: string;
  jenisBisnis: (typeof JENIS_BISNIS)[number];
};

export type Step2 = {
  lokasi: string;
  whatsapp: string;
  email: string;
};

export type Step3 = {
  vibe: 'casual' | 'professional' | 'elegant';
};

export type Step4 = {
  layanan: Array<{
    title: string;
    description: string;
  }>;
};
