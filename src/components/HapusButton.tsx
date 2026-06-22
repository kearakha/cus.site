'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { hapusBisnisAction } from '@/app/(dashboard)/dashboard/[subdomain]/actions';

type Props = {
  subdomain: string;
  namaBisnis: string;
};

export function HapusButton({ subdomain, namaBisnis }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="text-xs text-slate-400 hover:text-red-600"
      >
        Hapus
      </button>
    );
  }

  const handleHapus = () => {
    setError(null);
    startTransition(async () => {
      const result = await hapusBisnisAction(subdomain);
      if (!result.success) {
        setError(result.error);
        return;
      }
      // Sukses → refresh dashboard list
      router.refresh();
    });
  };

  return (
    <div className="rounded-lg bg-red-50 border border-red-200 p-3 space-y-2">
      <p className="text-xs text-red-800">
        Hapus <strong>{namaBisnis}</strong> selamanya?
      </p>
      {error && <p className="text-xs text-red-700">{error}</p>}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleHapus}
          disabled={isPending}
          className="text-xs font-semibold text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded disabled:opacity-50"
        >
          {isPending ? 'Menghapus...' : 'Ya, hapus'}
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          disabled={isPending}
          className="text-xs text-slate-600 hover:text-slate-900 px-2 py-1"
        >
          Batal
        </button>
      </div>
    </div>
  );
}
