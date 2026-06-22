import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getOwnerTokenFromCookie, getSessionEmail } from '@/lib/auth';

/**
 * Dashboard layout — CMS mini untuk owner.
 *
 * Guard:
 * - Kalau gak ada session email cookie ATAU legacy ownerToken cookie
 *   → redirect ke /login.
 *
 * Struktur:
 * - Top nav: logo Cus.site, link "Buat Website Baru", tombol logout
 * - Main content: child page
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sessionEmail = getSessionEmail();
  const ownerToken = getOwnerTokenFromCookie();
  if (!sessionEmail && !ownerToken) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-10 bg-white border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              href="/dashboard"
              className="font-bold text-slate-900 tracking-tight"
            >
              Cus<span className="text-slate-400">.site</span>
            </Link>
            <span className="hidden sm:inline-block text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              Dashboard
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/buat"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800 transition"
            >
              + Bikin Website Baru
            </Link>
            <form action="/api/owner/logout" method="POST">
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
              >
                Logout
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8">{children}</main>
    </div>
  );
}
