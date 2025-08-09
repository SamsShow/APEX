import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          DEFAULT: '#f97316',
          foreground: '#0b0b0b',
        },
        muted: {
          DEFAULT: '#1a1a1a',
          foreground: '#a1a1aa',
        },
        card: {
          DEFAULT: '#0f0f0f',
          foreground: '#e5e7eb',
        },
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
        glow: '0 0 0 1px rgba(249,115,22,.3), 0 20px 80px rgba(249,115,22,.15)',
      },
    },
  },
  plugins: [],
};
export default config;
