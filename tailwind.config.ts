import type { Config } from 'tailwindcss';
const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: { 50: '#fef3e2', 100: '#fde4b9', 200: '#fbd38d', 300: '#f6ad55', 400: '#ed8936', 500: '#dd6b20', 600: '#c05621', 700: '#9c4221', 800: '#7b341e', 900: '#652b19' },
        surface: { DEFAULT: '#0f0f0f', light: '#1a1a1a', lighter: '#262626' },
        text: { primary: '#fafafa', secondary: '#a3a3a3', muted: '#737373' },
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      maxWidth: { article: '720px' },
    },
  },
  plugins: [],
};
export default config;