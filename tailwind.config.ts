import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        // Vibe: casual → sans-serif modern
        casual: ['var(--font-casual)', 'system-ui', 'sans-serif'],
        // Vibe: professional → sans-serif clean
        professional: ['var(--font-professional)', 'system-ui', 'sans-serif'],
        // Vibe: elegant → serif
        elegant: ['var(--font-elegant)', 'Georgia', 'serif'],
        // Brand (landing) — lihat .docs/DESIGN.md
        display: ['var(--font-professional)', 'system-ui', 'sans-serif'],
        body: ['var(--font-casual)', 'system-ui', 'sans-serif'],
      },
      // Brand tokens landing — sumber: .docs/DESIGN.md
      colors: {
        cream: '#FBF7F0',
        navy: { DEFAULT: '#0F172A', 2: '#1E293B' },
        orange: { DEFAULT: '#F59E0B', deep: '#D97706', tint: '#FEF3C7' },
        ink: { 2: '#5C5548', 3: '#8A8275' },
        line: '#E8E0D2',
      },
      boxShadow: {
        card: '0 1px 2px rgba(15,23,42,.04)',
        'card-hover': '0 12px 32px -8px rgba(15,23,42,.16)',
        mockup:
          '0 1px 2px rgba(15,23,42,.06), 0 12px 32px -8px rgba(15,23,42,.12), 0 40px 80px -24px rgba(15,23,42,.28)',
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
