import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getOwnerTokenFromCookie, getSessionEmail } from '@/lib/auth';
import { DarkModeToggle } from '@/components/DarkModeToggle';

/**
 * Dashboard layout — CMS mini untuk owner.
 *
 * Guard:
 * - Kalau gak ada session email cookie ATAU legacy ownerToken cookie
 *   → redirect ke /login.
 *
 * Struktur:
 * - Top nav: logo Cus.site, link "Buat Website Baru", tombol logout, dark mode toggle
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      <header className="sticky top-0 z-10 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              href="/dashboard"
              className="font-bold text-slate-900 dark:text-white tracking-tight"
            >
              Cus<span className="text-slate-400 dark:text-slate-500">.site</span>
            </Link>
            <span className="hidden sm:inline-block text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              Dashboard
            </span>
          </div>
          <div className="flex items-center gap-2">
            <DarkModeToggle />
            <Link
              href="/buat"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-slate-900 dark:bg-white px-3 py-1.5 text-xs font-medium text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 transition"
            >
              + Bikin Website Baru
            </Link>
            <form action="/api/owner/logout" method="POST">
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
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

