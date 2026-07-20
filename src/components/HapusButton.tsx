'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { hapusBisnisAction } from '@/app/(dashboard)/dashboard/[subdomain]/actions';
import { ConfirmDialog } from './ConfirmDialog';

type Props = {
  subdomain: string;
  namaBisnis: string;
};

export function HapusButton({ subdomain, namaBisnis }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = () => {
    setError(null);
    startTransition(async () => {
      const result = await hapusBisnisAction(subdomain);
      if (!result.success) {
        setError(result.error);
        return;
      }
      setOpen(false);
      // Sukses → refresh dashboard list
      router.refresh();
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-xs text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition"
      >
        Hapus
      </button>

      <ConfirmDialog
        open={open}
        onClose={() => !isPending && setOpen(false)}
        onConfirm={handleConfirm}
        title="Hapus Website"
        confirmLabel="Ya, Hapus Selamanya"
        cancelLabel="Batal"
        isPending={isPending}
        variant="danger"
      >
        <p>
          Kamu yakin mau hapus <strong>{namaBisnis}</strong>? Semua data
          termasuk konten AI, layanan, dan gambar akan hilang permanen.
        </p>
        {error && (
          <p className="mt-2 text-xs text-red-600 dark:text-red-400">{error}</p>
        )}
      </ConfirmDialog>
    </>
  );
}

