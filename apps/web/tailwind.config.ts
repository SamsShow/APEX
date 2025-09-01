import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        jersey: ['Jersey 25', 'cursive'],
        'jersey-25': ['Jersey 25', 'cursive'],
      },
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          DEFAULT: '#e5e7eb', // silver
          foreground: '#09090b',
        },
        muted: {
          DEFAULT: '#27272a', // zinc-800
          foreground: '#a1a1aa',
        },
        card: {
          DEFAULT: '#18181b', // zinc-900
          foreground: '#e5e7eb',
        },
        popover: {
          DEFAULT: '#18181b', // zinc-900
          foreground: '#e5e7eb',
        },
        input: '#3f3f46', // zinc-700
        accent: {
          DEFAULT: '#27272a', // zinc-800
          foreground: '#e5e7eb',
        },
        ring: '#3b82f6', // blue-500
      },
      container: {
        center: true,
        padding: '1rem',
        screens: {
          '2xl': '1280px',
        },
      },
      borderRadius: {
        xl: '1.25rem',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(229,231,235,.25), 0 20px 80px rgba(229,231,235,.12)',
      },
    },
  },
  plugins: [],
};
export default config;
