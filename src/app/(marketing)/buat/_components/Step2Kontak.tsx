'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { step2Schema, type Step2 } from './step-schemas';

type Props = {
  defaultValues: { lokasi: string; whatsapp: string; email?: string };
  onBack: () => void;
  onNext: (values: Step2) => void;
};

export function Step2Kontak({ defaultValues, onBack, onNext }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Step2>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      lokasi: defaultValues.lokasi,
      whatsapp: defaultValues.whatsapp,
      email: defaultValues.email ?? '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Di mana, kontak & email</h2>
        <p className="mt-1 text-sm text-slate-600">
          Supaya pelanggan tahu lokasi, cara order, dan kamu bisa login lagi nanti.
        </p>
      </div>

      <div>
        <label htmlFor="lokasi" className="block text-sm font-medium text-slate-700">
          Lokasi / Alamat
        </label>
        <input
          id="lokasi"
          type="text"
          placeholder="Contoh: Jl. Kaliurang KM 5, Yogyakarta"
          {...register('lokasi')}
          className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
        />
        {errors.lokasi && (
          <p className="mt-1.5 text-xs text-red-600">{errors.lokasi.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="whatsapp" className="block text-sm font-medium text-slate-700">
          WhatsApp <span className="text-slate-400 font-normal">(untuk tombol order)</span>
        </label>
        <input
          id="whatsapp"
          type="tel"
          inputMode="numeric"
          placeholder="081234567890 atau 6281234567890"
          {...register('whatsapp')}
          className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
        />
        {errors.whatsapp && (
          <p className="mt-1.5 text-xs text-red-600">{errors.whatsapp.message}</p>
        )}
        <p className="mt-1.5 text-xs text-slate-500">
          Format angka saja, boleh pakai awalan 62 atau 0.
        </p>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-700">
          Email kamu{' '}
          <span className="text-slate-400 font-normal">(untuk login & edit nanti)</span>
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="kamu@email.com"
          {...register('email')}
          className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
        />
        {errors.email && (
          <p className="mt-1.5 text-xs text-red-600">{errors.email.message}</p>
        )}
        <p className="mt-1.5 text-xs text-slate-500">
          Dipakai untuk login di <code className="font-mono">/login</code>. Tidak
          untuk spam.
        </p>
      </div>

      <div className="flex justify-between pt-2">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
        >
          ← Kembali
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 transition disabled:opacity-50"
        >
          Lanjut →
        </button>
      </div>
    </form>
  );
}
