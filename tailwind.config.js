/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./frontend/**/*.html",
    "./frontend/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        gold: '#FFFFFF',
        'gold-dark': '#E5E5E5',
        'gold-light': '#F5F5F5',
        dark: '#000000',
        'dark-2': '#111315',
        'dark-3': '#1A1C1F',
        'dark-4': '#222',
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Poppins', 'Inter', 'sans-serif'],
      },
      animation: {
        float: 'float 5s ease-in-out infinite',
        'fade-up': 'fadeUp 0.6s ease-out',
        'pulse-green': 'pulseGreen 2s infinite',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'slide-in-up': 'slideInUp 0.4s ease-out',
        'bounce-in': 'bounceIn 0.5s ease-out',
        shimmer: 'shimmer 2s infinite',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGreen: {
          '0%,100%': { boxShadow: '0 0 0 0 rgba(15,175,143,0.6)' },
          '70%': { boxShadow: '0 0 0 12px rgba(15,175,143,0)' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.04)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
