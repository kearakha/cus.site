"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-7xl font-black text-slate-200 select-none">500</p>
        <h1 className="mt-4 text-2xl font-bold text-slate-900">
          Ada yang salah
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Terjadi kesalahan di server. Coba lagi atau hubungi kami.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 transition"
          >
            Coba Lagi
          </button>
          <a
            href="/"
            className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition"
          >
            Beranda
          </a>
        </div>
      </div>
    </div>
  );
}
