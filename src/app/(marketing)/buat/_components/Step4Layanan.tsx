'use client';

import { useState } from 'react';
import { step4Schema, type LayananItem } from './step-schemas';
import { ImageUploader } from '@/components/ImageUploader';

type Props = {
  defaultValues: LayananItem[];
  onBack: () => void;
  onNext: (values: LayananItem[]) => void;
};

const EMPTY_ITEM: LayananItem = { title: '', description: '', imageUrl: '' };

export function Step4Layanan({ defaultValues, onBack, onNext }: Props) {
  const [items, setItems] = useState<LayananItem[]>(
    defaultValues.length > 0 ? defaultValues : [EMPTY_ITEM],
  );
  const [errors, setErrors] = useState<Record<number, { title?: string; description?: string }>>({});

  const update = (i: number, patch: Partial<LayananItem>) => {
    setItems((arr) => arr.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  };

  const add = () => {
    if (items.length >= 8) return;
    setItems((arr) => [...arr, EMPTY_ITEM]);
  };

  const remove = (i: number) => {
    if (items.length <= 1) return;
    setItems((arr) => arr.filter((_, idx) => idx !== i));
  };

  const handleNext = () => {
    const result = step4Schema.safeParse({ layanan: items });
    if (!result.success) {
      const newErrors: Record<number, { title?: string; description?: string }> = {};
      result.error.issues.forEach((issue) => {
        const idx = issue.path[1];
        const field = issue.path[2];
        if (typeof idx === 'number') {
          newErrors[idx] = {
            ...newErrors[idx],
            ...(field === 'title' ? { title: issue.message } : {}),
            ...(field === 'description' ? { description: issue.message } : {}),
          };
        }
      });
      setErrors(newErrors);
      return;
    }
    onNext(result.data.layanan as LayananItem[]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Layanan / Produk</h2>
        <p className="mt-1 text-sm text-slate-600">
          Tambah 1–8 layanan. AI akan enhance copywriting-nya.
        </p>
      </div>

      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={i} className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500">LAYANAN #{i + 1}</span>
              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="text-xs text-red-600 hover:text-red-800"
                >
                  Hapus
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="sm:col-span-1">
                <ImageUploader
                  label="Foto"
                  value={item.imageUrl || ''}
                  onChange={(url) => update(i, { imageUrl: url })}
                  aspect="square"
                  hint="Opsional. Square."
                />
              </div>

              <div className="sm:col-span-3 space-y-3">
                <div>
                  <input
                    type="text"
                    placeholder="Contoh: Kopi Susu"
                    value={item.title}
                    onChange={(e) => update(i, { title: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                  />
                  {errors[i]?.title && (
                    <p className="mt-1 text-xs text-red-600">{errors[i].title}</p>
                  )}
                </div>

                <div>
                  <textarea
                    placeholder="Deskripsi singkat, contoh: kopi susu kekinian harga ramah di kantong"
                    value={item.description}
                    onChange={(e) => update(i, { description: e.target.value })}
                    rows={3}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 resize-none"
                  />
                  {errors[i]?.description && (
                    <p className="mt-1 text-xs text-red-600">{errors[i].description}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {items.length < 8 && (
          <button
            type="button"
            onClick={add}
            className="w-full rounded-xl border-2 border-dashed border-slate-300 px-4 py-3 text-sm font-medium text-slate-600 hover:border-slate-400 hover:text-slate-900 transition"
          >
            + Tambah Layanan
          </button>
        )}
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
          type="button"
          onClick={handleNext}
          className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 transition"
        >
          Lanjut →
        </button>
      </div>
    </div>
  );
}
