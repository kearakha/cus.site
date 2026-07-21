import { useState, useEffect } from 'react';
import { Rocket } from 'lucide-react';
import { step5Schema } from './step-schemas';

type Props = {
  defaultValue: string;
  bisnisName: string;
  onBack: () => void;
  onGenerate: (subdomain: string) => void;
};

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'cus.site';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 32);
}

export function Step5Subdomain({ defaultValue, bisnisName, onBack, onGenerate }: Props) {
  const [value, setValue] = useState(defaultValue || slugify(bisnisName));
  const [error, setError] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    const parsed = step5Schema.safeParse({ subdomain: value });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Subdomain tidak valid');
      setIsAvailable(null);
      return;
    }
    setError(null);

    const controller = new AbortController();
    const handler = setTimeout(async () => {
      setIsChecking(true);
      try {
        const res = await fetch(`/api/check-subdomain?slug=${value}`, {
          signal: controller.signal,
        });
        if (res.ok) {
          const data = await res.json();
          setIsAvailable(data.available);
          if (!data.available) {
            setError('Subdomain sudah digunakan oleh bisnis lain');
          } else {
            setError(null);
          }
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error(err);
        }
      } finally {
        setIsChecking(false);
      }
    }, 500);

    return () => {
      clearTimeout(handler);
      controller.abort();
    };
  }, [value]);

  const handleGenerate = () => {
    const result = step5Schema.safeParse({ subdomain: value });
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? 'Subdomain tidak valid');
      return;
    }
    if (isAvailable === false) {
      setError('Subdomain sudah digunakan oleh bisnis lain');
      return;
    }
    setError(null);
    onGenerate(result.data.subdomain);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Pilih alamat website</h2>
        <p className="mt-1 text-sm text-slate-600">
          Ini alamat yang akan dibuka pelanggan kamu.
        </p>
      </div>

      <div>
        <label htmlFor="subdomain" className="block text-sm font-medium text-slate-700">
          Subdomain
        </label>
        <div className="mt-1.5 flex items-stretch rounded-lg border border-slate-300 focus-within:border-slate-900 focus-within:ring-2 focus-within:ring-slate-900/10 overflow-hidden">
          <input
            id="subdomain"
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value.toLowerCase())}
            placeholder="kopisrawung"
            autoComplete="off"
            spellCheck={false}
            className="flex-1 px-3.5 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none bg-white"
          />
          {isChecking && (
            <span className="flex items-center px-2.5 bg-white text-xs text-slate-400 font-medium">
              Checking...
            </span>
          )}
          {isAvailable && !isChecking && (
            <span className="flex items-center px-2.5 bg-white text-xs text-emerald-500 font-bold">
              ✓ Tersedia
            </span>
          )}
          <span className="flex items-center px-3 bg-slate-50 text-sm text-slate-500 border-l border-slate-300">
            .{ROOT_DOMAIN}
          </span>
        </div>
        {error ? (
          <p className="mt-1.5 text-xs text-red-600">{error}</p>
        ) : (
          <p className="mt-1.5 text-xs text-slate-500">
            Hanya huruf kecil, angka, dan strip. 3–32 karakter.
          </p>
        )}
      </div>

      {value && !error && isAvailable && (
        <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-4">
          <p className="text-xs font-medium text-emerald-700">Preview URL:</p>
          <p className="mt-1 font-mono text-sm text-emerald-900 break-all">
            https://{value}.{ROOT_DOMAIN}
          </p>
        </div>
      )}

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
          onClick={handleGenerate}
          disabled={isChecking || isAvailable === false}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-slate-900 to-slate-700 px-6 py-2.5 text-sm font-semibold text-white hover:from-slate-800 hover:to-slate-600 transition shadow-lg shadow-slate-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Rocket className="h-4 w-4" strokeWidth={2.5} />
          Generate Website
        </button>
      </div>
    </div>
  );
}
