'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle2, ExternalLink } from 'lucide-react';
import { loginWithEmailAction } from '../actions';

type Props = {
  /** Error message dari query string (?error=...) */
  error?: string;
};

const ERROR_MESSAGES: Record<string, string> = {
  invalid_or_expired:
    'Link login gak valid atau sudah kedaluwarsa. Request link baru di bawah.',
  missing_token: 'Link login gak lengkap. Request link baru di bawah.',
  claim_used:
    'Link akses ini sudah pernah dipakai. Login via email di bawah untuk dapat link baru.',
};

export function LoginForm({ error: errorCode }: Props) {
  const [email, setEmail] = useState('');
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(
    errorCode ? ERROR_MESSAGES[errorCode] ?? 'Login gagal.' : null,
  );
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [devLink, setDevLink] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const formData = new FormData();
      formData.set('email', email);

      const result = await loginWithEmailAction(formData);

      if (!result.success) {
        setError(result.error);
        return;
      }

      setSentTo(result.email);
      if (result.devMagicLink) setDevLink(result.devMagicLink);
    });
  };

  // === Success state: "cek email kamu" ===
  if (sentTo) {
    return (
      <div className="space-y-5">
        <div className="flex flex-col items-center text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center">
            <CheckCircle2 className="h-6 w-6 text-emerald-600" strokeWidth={2} />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-slate-900">
            Cek email kamu
          </h2>
          <p className="mt-2 text-sm text-slate-600 max-w-sm">
            Kami udah kirim link login ke{' '}
            <strong className="text-slate-900">{sentTo}</strong>. Link berlaku
            15 menit.
          </p>
        </div>

        {devLink && (
          <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 space-y-2">
            <p className="text-xs font-semibold text-amber-900">
              🛠 Dev mode (RESEND_API_KEY belum di-set)
            </p>
            <p className="text-xs text-amber-800">
              Klik link ini buat login (di production, link dikirim via email):
            </p>
            <a
              href={devLink}
              className="block text-xs font-mono text-amber-900 underline break-all hover:text-amber-700"
            >
              {devLink}
            </a>
          </div>
        )}

        <div className="text-center space-y-2 pt-2">
          <button
            type="button"
            onClick={() => {
              setSentTo(null);
              setDevLink(null);
            }}
            className="text-sm font-medium text-slate-700 hover:text-slate-900 inline-flex items-center gap-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Kirim ulang ke email lain
          </button>
        </div>
      </div>
    );
  }

  // === Form state ===
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-700">
          Email
        </label>
        <div className="mt-1.5 relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="kamu@email.com"
            className="w-full rounded-lg border border-slate-300 pl-10 pr-3.5 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
          />
        </div>
        <p className="mt-1.5 text-xs text-slate-500">
          Masukin email yang kamu pakai pas bikin website.
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isPending || email.length === 0}
        className="w-full inline-flex items-center justify-center rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 transition disabled:opacity-50"
      >
        {isPending ? 'Mengirim...' : 'Kirim Link Login'}
      </button>

      <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 text-xs text-slate-600 space-y-1.5">
        <p className="font-semibold text-slate-700">Cara kerja:</p>
        <ol className="list-decimal list-inside space-y-0.5 pl-1">
          <li>Klik tombol di atas</li>
          <li>Cek inbox email kamu</li>
          <li>Klik link di email (15 menit)</li>
          <li>Otomatis login ke dashboard</li>
        </ol>
      </div>
    </form>
  );
}
