'use client';

import { useState } from 'react';
import { Check, Edit3, LogOut, MoreHorizontal, ExternalLink } from 'lucide-react';

type Props = {
  subdomain: string;
};

/**
 * Floating Admin Bar — muncul hanya untuk owner bisnis (lihat tenant page).
 *
 * UX:
 * - Banner top tipis "OWNER MODE" dengan 2 CTA utama: Edit + Lihat Dashboard
 * - Toggle button pojok kanan bawah → expand panel menu (logout, dll)
 */
export function FloatingAdminBar({ subdomain }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Top banner — selalu visible saat owner mode */}
      <div className="fixed top-0 inset-x-0 z-40 bg-slate-900 text-white shadow-lg">
        <div className="mx-auto max-w-6xl px-4 py-2 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500">
              <Check className="h-3 w-3 text-slate-900" strokeWidth={3} />
            </span>
            <span className="font-semibold tracking-wide">OWNER MODE</span>
            <span className="hidden sm:inline text-slate-400">—</span>
            <code className="hidden sm:inline text-emerald-300 font-mono">{subdomain}.cus.site</code>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={`/dashboard/${subdomain}`}
              className="inline-flex items-center gap-1.5 rounded-full bg-white text-slate-900 px-3 py-1 font-semibold hover:bg-slate-100 transition"
            >
              <Edit3 className="h-3.5 w-3.5" strokeWidth={2} />
              Edit Website
            </a>
            <a
              href="/dashboard"
              className="hidden sm:inline-flex items-center gap-1 text-slate-300 hover:text-white"
            >
              Dashboard
              <ExternalLink className="h-3 w-3" strokeWidth={2} />
            </a>
          </div>
        </div>
      </div>

      {/* Spacer biar konten tenant page gak ketutup banner */}
      <div className="h-10" aria-hidden />

      {/* Toggle button bottom-right + expandable panel */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2 font-casual">
        {open && (
          <div className="w-64 rounded-2xl bg-slate-900 text-white shadow-2xl ring-1 ring-slate-700 overflow-hidden animate-in fade-in slide-in-from-bottom-2">
            <div className="px-4 py-3 border-b border-slate-700 flex items-center justify-between">
              <span className="text-xs font-semibold tracking-wide">MENU</span>
              <button
                onClick={() => setOpen(false)}
                className="text-slate-400 hover:text-white text-sm leading-none"
                aria-label="Tutup"
              >
                ✕
              </button>
            </div>
            <div className="border-t border-slate-800">
              <form action="/api/owner/logout" method="POST">
                <button
                  type="submit"
                  className="w-full text-left px-4 py-3 text-sm hover:bg-slate-800 transition text-red-300 inline-flex items-center gap-2"
                >
                  <LogOut className="h-3.5 w-3.5" strokeWidth={2} />
                  Logout Owner
                </button>
              </form>
            </div>
          </div>
        )}

        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 rounded-full bg-slate-900 pl-3 pr-4 py-3 text-white shadow-2xl hover:bg-slate-800 hover:scale-105 transition-all"
          aria-label="Owner menu"
        >
          <MoreHorizontal className="h-4 w-4" strokeWidth={2.5} />
          <span className="text-xs font-semibold tracking-wide">Menu</span>
        </button>
      </div>
    </>
  );
}
