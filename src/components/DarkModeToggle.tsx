'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

/**
 * DarkModeToggle — toggles dark mode for the dashboard.
 *
 * Persists preference to localStorage. Adds/removes `dark` class
 * on <html> element (Tailwind dark mode strategy: "class").
 */
export function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('cus-dark-mode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = stored === 'true' || (stored === null && prefersDark);
    setIsDark(shouldBeDark);
    document.documentElement.classList.toggle('dark', shouldBeDark);
  }, []);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem('cus-dark-mode', String(next));
    document.documentElement.classList.toggle('dark', next);
  };

  // Avoid hydration mismatch — render placeholder until mounted
  if (!mounted) {
    return (
      <button
        type="button"
        className="rounded-lg border border-slate-300 bg-white p-1.5 text-slate-400"
        aria-label="Toggle dark mode"
      >
        <Sun className="h-4 w-4" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </button>
  );
}
