'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

type Props = {
  link: string;
  label?: string;
};

/**
 * Card untuk menampilkan "access link" yang bisa di-bookmark.
 * Tombol copy menyalin URL ke clipboard.
 */
export function AccessLinkCard({ link, label = 'Copy Link' }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: select text
      const el = document.getElementById('access-link-input');
      if (el) {
        (el as HTMLInputElement).select();
      }
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        id="access-link-input"
        type="text"
        readOnly
        value={link}
        onClick={(e) => (e.target as HTMLInputElement).select()}
        className="flex-1 min-w-0 rounded-lg border border-amber-300 bg-white px-3 py-2 text-xs font-mono text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
      />
      <button
        type="button"
        onClick={handleCopy}
        className={`flex-shrink-0 inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition ${
          copied
            ? 'bg-emerald-600 text-white'
            : 'bg-amber-900 text-amber-50 hover:bg-amber-800'
        }`}
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
            Tersalin
          </>
        ) : (
          <>
            <Copy className="h-3.5 w-3.5" strokeWidth={2} />
            {label}
          </>
        )}
      </button>
    </div>
  );
}
