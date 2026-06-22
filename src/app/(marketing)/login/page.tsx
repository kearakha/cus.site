import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { OWNER_COOKIE_NAME, SESSION_COOKIE_NAME_EXPORT } from '@/lib/auth';
import { LoginForm } from './_components/LoginForm';

export const metadata = {
  title: 'Login — Cus.site',
};

type Props = {
  searchParams: { error?: string; success?: string };
};

export default function LoginPage({ searchParams }: Props) {
  // Kalau udah login (session email ATAU legacy ownerToken) → redirect ke dashboard
  const hasSession =
    cookies().get(SESSION_COOKIE_NAME_EXPORT)?.value ||
    cookies().get(OWNER_COOKIE_NAME)?.value;
  if (hasSession) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header sederhana */}
      <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center">
          <Link href="/" className="flex items-center gap-1.5">
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Cus<span className="text-amber-500">.</span>site
            </span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Login ke Cus.site
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Masukin email yang kamu pakai pas bikin website.
            </p>
          </div>

          <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 sm:p-8">
            <LoginForm error={searchParams.error} />
          </div>

          <p className="mt-6 text-center text-sm text-slate-600">
            Belum punya website?{' '}
            <Link href="/buat" className="font-semibold text-amber-700 hover:text-amber-800">
              Bikin dulu →
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
