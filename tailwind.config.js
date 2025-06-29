/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)'],
        mono: ['var(--font-roboto-mono)']
      },
      keyframes: {
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'float-reverse': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(20px)' },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '0.4' },
        },
        'ping-slow': {
          '0%, 100%': { 
            transform: 'scale(1)',
            opacity: '0.8'
          },
          '50%': { 
            transform: 'scale(1.5)',
            opacity: '0'
          },
        }
      },
      animation: {
        'float': 'float 15s ease-in-out infinite',
        'float-slow': 'float 20s ease-in-out infinite',
        'float-reverse': 'float-reverse 15s ease-in-out infinite',
        'pulse-slow': 'pulse-slow 10s ease-in-out infinite',
        'ping-slow': 'ping-slow 8s ease-in-out infinite',
      },
      colors: {
        // Light theme colors
        light: {
          background: '#F5FBFF',
          primary: '#FF6F61',
          secondary: '#2196F3',
          text: '#212121',
          textSecondary: '#555555',
          success: '#4CAF50',
          warning: '#FFC107',
          surface: '#FFFFFF'
        },
        // Dark theme colors
        dark: {
          background: '#121212',
          surface: '#1E1E1E',
          primary: '#FF8A65',
          secondary: '#64B5F6',
          text: '#E0E0E0',
          textSecondary: '#B0B0B0',
          success: '#81C784',
          warning: '#FFD54F'
        },
        // Semantic colors that work in both themes
        primary: {
          DEFAULT: '#FF6F61',
          dark: '#FF8A65'
        },
        secondary: {
          DEFAULT: '#2196F3',
          dark: '#64B5F6'
        },
        success: {
          DEFAULT: '#4CAF50',
          dark: '#81C784'
        },
        warning: {
          DEFAULT: '#FFC107',
          dark: '#FFD54F'
        },
        background: {
          DEFAULT: '#F5FBFF',
          dark: '#121212'
        },
        surface: {
          DEFAULT: '#FFFFFF',
          dark: '#1E1E1E'
        }
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography')
  ]
};
