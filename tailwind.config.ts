import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-space-grotesk)', 'system-ui', 'sans-serif'],
      },
      colors: {
        neo: {
          black: '#1a1a1a',
          white: '#ffffff',
          blue: '#3b82f6',
          'blue-dark': '#1d4ed8',
          yellow: '#fbbf24',
          'yellow-dark': '#d97706',
          purple: '#7c3aed',
          'purple-dark': '#5b21b6',
          pink: '#ec4899',
          green: '#22c55e',
          red: '#ef4444',
        },
      },
      boxShadow: {
        'neo': '4px 4px 0px 0px #1a1a1a',
        'neo-lg': '6px 6px 0px 0px #1a1a1a',
        'neo-xl': '8px 8px 0px 0px #1a1a1a',
        'neo-hover': '2px 2px 0px 0px #1a1a1a',
        'neo-none': '0px 0px 0px 0px #1a1a1a',
      },
      borderWidth: {
        'neo': '3px',
      },
    },
  },
  plugins: [],
};

export default config;
