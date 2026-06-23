'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { step2Schema, HARI_OPERASIONAL_OPTIONS, type Step2 } from './step-schemas';

type Props = {
  defaultValues: {
    lokasi: string;
    whatsapp: string;
    email?: string;
    instagram?: string;
    tiktok?: string;
    facebook?: string;
    jamBuka?: string;
    jamTutup?: string;
    hariOperasional?: string;
  };
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
      instagram: defaultValues.instagram ?? '',
      tiktok: defaultValues.tiktok ?? '',
      facebook: defaultValues.facebook ?? '',
      jamBuka: defaultValues.jamBuka ?? '',
      jamTutup: defaultValues.jamTutup ?? '',
      hariOperasional: (defaultValues.hariOperasional as Step2['hariOperasional']) ?? '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Kontak & operasional</h2>
        <p className="mt-1 text-sm text-slate-600">
          Supaya pelanggan tahu lokasi, cara order, jam buka, dan social media kamu.
        </p>
      </div>

      <div className="space-y-4">
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
          <p className="mt-1.5 text-xs text-slate-500">
            Dipakai untuk embed peta otomatis.
          </p>
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
        </div>
      </div>

      {/* === Operasional === */}
      <div className="border-t border-slate-200 pt-5">
        <h3 className="text-sm font-semibold text-slate-900 mb-3">
          Jam Operasional <span className="text-slate-400 font-normal">(opsional)</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label htmlFor="hariOperasional" className="block text-xs font-medium text-slate-600 mb-1">
              Hari
            </label>
            <select
              id="hariOperasional"
              {...register('hariOperasional')}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
            >
              <option value="">Pilih...</option>
              {HARI_OPERASIONAL_OPTIONS.map((h) => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="jamBuka" className="block text-xs font-medium text-slate-600 mb-1">
              Jam Buka
            </label>
            <input
              id="jamBuka"
              type="time"
              {...register('jamBuka')}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
            />
            {errors.jamBuka && (
              <p className="mt-1 text-xs text-red-600">{errors.jamBuka.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="jamTutup" className="block text-xs font-medium text-slate-600 mb-1">
              Jam Tutup
            </label>
            <input
              id="jamTutup"
              type="time"
              {...register('jamTutup')}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
            />
            {errors.jamTutup && (
              <p className="mt-1 text-xs text-red-600">{errors.jamTutup.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* === Social Media === */}
      <div className="border-t border-slate-200 pt-5">
        <h3 className="text-sm font-semibold text-slate-900 mb-3">
          Social Media <span className="text-slate-400 font-normal">(opsional)</span>
        </h3>
        <p className="text-xs text-slate-500 mb-3">
          Isi username saja (tanpa @ dan tanpa link). Otomatis dijadikan link.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label htmlFor="instagram" className="block text-xs font-medium text-slate-600 mb-1">
              Instagram
            </label>
            <div className="flex items-stretch">
              <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-slate-300 bg-slate-50 text-slate-500 text-sm">
                @
              </span>
              <input
                id="instagram"
                type="text"
                placeholder="username"
                {...register('instagram')}
                className="flex-1 rounded-r-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
              />
            </div>
            {errors.instagram && (
              <p className="mt-1 text-xs text-red-600">{errors.instagram.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="tiktok" className="block text-xs font-medium text-slate-600 mb-1">
              TikTok
            </label>
            <div className="flex items-stretch">
              <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-slate-300 bg-slate-50 text-slate-500 text-sm">
                @
              </span>
              <input
                id="tiktok"
                type="text"
                placeholder="username"
                {...register('tiktok')}
                className="flex-1 rounded-r-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
              />
            </div>
            {errors.tiktok && (
              <p className="mt-1 text-xs text-red-600">{errors.tiktok.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="facebook" className="block text-xs font-medium text-slate-600 mb-1">
              Facebook
            </label>
            <input
              id="facebook"
              type="text"
              placeholder="username atau page slug"
              {...register('facebook')}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
            />
            {errors.facebook && (
              <p className="mt-1 text-xs text-red-600">{errors.facebook.message}</p>
            )}
          </div>
        </div>
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
