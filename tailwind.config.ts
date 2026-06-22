import type { Config } from 'tailwindcss';

const config: Config = {
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
      },
    },
  },
  plugins: [],
};

export default config;
