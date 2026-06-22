'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import { VIBE_OPTIONS, VIBE_DESCRIPTIONS, type VibeOption } from './steps';

type Props = {
  defaultValue?: VibeOption;
  onBack: () => void;
  onNext: (value: VibeOption) => void;
};

export function Step3Vibe({ defaultValue, onBack, onNext }: Props) {
  const [selected, setSelected] = useState<VibeOption | undefined>(defaultValue);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Pilih vibe website</h2>
        <p className="mt-1 text-sm text-slate-600">
          Ini menentukan gaya bahasa, font, dan warna.
        </p>
      </div>

      <div className="grid gap-3">
        {VIBE_OPTIONS.map((vibe) => {
          const desc = VIBE_DESCRIPTIONS[vibe];
          const isSelected = selected === vibe;
          return (
            <button
              key={vibe}
              type="button"
              onClick={() => setSelected(vibe)}
              className={`text-left rounded-xl border-2 p-4 transition ${
                isSelected
                  ? 'border-slate-900 bg-slate-50 ring-2 ring-slate-900/10'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{desc.emoji}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className={`font-semibold ${desc.fontClass}`}>{desc.title}</h3>
                    {isSelected && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-900">
                        <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                        Terpilih
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-slate-600">{desc.desc}</p>
                </div>
              </div>
            </button>
          );
        })}
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
          disabled={!selected}
          onClick={() => selected && onNext(selected)}
          className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Lanjut →
        </button>
      </div>
    </div>
  );
}
