import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/hooks/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Navy Blue (educational authority)
        navy: {
          50:  '#EBF0FA',
          100: '#D6E1F5',
          200: '#ADC3EA',
          300: '#84A5DF',
          400: '#5B87D4',
          500: '#3269C9',
          600: '#1B4F9B', // main primary
          700: '#163F7A',
          800: '#102F5A',
          900: '#0A1F3B',
          950: '#060F1D',
        },
        // Accent green for positive/success actions
        emerald: {
          50:  '#DCFCE7',
          100: '#BBF7D0',
          500: '#22C55E',
          600: '#16A34A', // main accent
          700: '#15803D',
          900: '#14532D',
        },
        // Highlight orange (alerts, result dates)
        orange: {
          50:  '#FFF7ED',
          100: '#FFEDD5',
          500: '#F97316',
          600: '#EA580C', // main highlight
          700: '#C2410C',
        },
        // Neutral grays
        slate: {
          50:  '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#374151',
          800: '#1F2937',
          900: '#1A1A2E',
        },
      },
      fontFamily: {
        sans: [
          'Segoe UI',
          '-apple-system',
          'BlinkMacSystemFont',
          'Roboto',
          'Arial',
          'sans-serif',
        ],
        mono: ['Courier New', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '6px',
        sm: '4px',
        md: '6px',
        lg: '8px',
        xl: '12px',
      },
      boxShadow: {
        card: '0 1px 4px rgba(0,0,0,0.08)',
        'card-hover': '0 4px 16px rgba(27,79,155,0.12)',
        nav: '0 2px 8px rgba(0,0,0,0.10)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
