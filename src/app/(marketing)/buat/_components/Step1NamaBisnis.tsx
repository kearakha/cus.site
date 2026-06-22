'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { step1Schema, JENIS_OPTIONS, type Step1 } from './step-schemas';

type Props = {
  defaultValues: { namaBisnis: string; jenisBisnis?: string };
  onNext: (values: Step1) => void;
};

export function Step1NamaBisnis({ defaultValues, onNext }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Step1>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      namaBisnis: defaultValues.namaBisnis,
      jenisBisnis: defaultValues.jenisBisnis as Step1['jenisBisnis'] | undefined,
    },
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Tentang bisnis kamu</h2>
        <p className="mt-1 text-sm text-slate-600">
          Mulai dari nama dan jenis usaha.
        </p>
      </div>

      <div>
        <label htmlFor="namaBisnis" className="block text-sm font-medium text-slate-700">
          Nama Bisnis
        </label>
        <input
          id="namaBisnis"
          type="text"
          placeholder="Contoh: Kopi Srawung, Salon Makmur"
          {...register('namaBisnis')}
          className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
        />
        {errors.namaBisnis && (
          <p className="mt-1.5 text-xs text-red-600">{errors.namaBisnis.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="jenisBisnis" className="block text-sm font-medium text-slate-700">
          Jenis Bisnis
        </label>
        <select
          id="jenisBisnis"
          {...register('jenisBisnis')}
          className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-slate-900 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 bg-white"
        >
          <option value="">Pilih jenis bisnis...</option>
          {JENIS_OPTIONS.map((j) => (
            <option key={j} value={j}>
              {j}
            </option>
          ))}
        </select>
        {errors.jenisBisnis && (
          <p className="mt-1.5 text-xs text-red-600">{errors.jenisBisnis.message}</p>
        )}
      </div>

      <div className="flex justify-end pt-2">
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
