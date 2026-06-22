'use client';

import { useState, useTransition } from 'react';
import { loginWithEmailAction } from '../actions';

type Props = {
  error?: string;
};

export function LoginForm({ error: initialError }: Props) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(initialError ?? null);
  const [isPending, startTransition] = useTransition();

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

      // Sukses → redirect ke dashboard
      window.location.href = '/dashboard';
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-700">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="kamu@email.com"
          className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
        />
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
        {isPending ? 'Login...' : 'Login'}
      </button>

      <p className="text-xs text-slate-500 text-center pt-2">
        Login otomatis pake token. Gak perlu password.
      </p>
    </form>
  );
}
