'use client';

import { useState } from 'react';
import { Check, Edit3, LogOut, MoreHorizontal, ExternalLink, Copy } from 'lucide-react';

type Props = {
  subdomain: string;
  /** URL absolut ke tenant site (dari buildSiteUrl). Optional — fallback ke env-based kalau tidak ada */
  siteUrl?: string;
};

/**
 * Floating Admin Bar — muncul hanya untuk owner bisnis (lihat tenant page).
 *
 * UX:
 * - Banner top tipis "OWNER MODE" dengan 2 CTA utama: Edit + Lihat Dashboard
 * - Toggle button pojok kanan bawah → expand panel menu (copy link, logout, dll)
 */
export function FloatingAdminBar({ subdomain, siteUrl }: Props) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const visitorUrl = siteUrl ?? `http://${subdomain}.localhost:3000`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(visitorUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: select text
      window.prompt('Copy URL ini:', visitorUrl);
    }
  };

  return (
    <>
      {/* Top banner — selalu visible saat owner mode */}
      <div className="fixed top-0 inset-x-0 z-40 bg-slate-900 text-white shadow-lg">
        <div className="mx-auto max-w-6xl px-4 py-2 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 flex-shrink-0">
              <Check className="h-3 w-3 text-slate-900" strokeWidth={3} />
            </span>
            <span className="font-semibold tracking-wide">OWNER MODE</span>
            <span className="hidden sm:inline text-slate-400">—</span>
            <code className="hidden sm:inline text-emerald-300 font-mono truncate">
              {subdomain}.cus.site
            </code>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
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

            {/* Copy visitor URL */}
            <button
              type="button"
              onClick={copy}
              className="w-full text-left px-4 py-3 text-sm hover:bg-slate-800 transition border-b border-slate-800 inline-flex items-center gap-2"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" strokeWidth={2.5} />
                  <span className="text-emerald-400">Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" strokeWidth={2} />
                  Copy URL Website
                </>
              )}
            </button>

            {/* Logout */}
            <div>
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
