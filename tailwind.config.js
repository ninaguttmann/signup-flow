/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1440px',
      '3xl': '1920px',
    },
    extend: {
      colors: {
        primary: {
          main: '#1565D8',
          hover: '#0D4FAD',
        },
        text: {
          main: '#000000',
          secondary: '#8692A6',
          inverse: '#FFFFFF',
          muted: '#696F79',
          input: '#494949',
          placeholder: '#BDBDBD',
        },
        error: '#F73A3A',
        'card-hover': '#F5F9FF',
        divider: '#F5F5F5',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'heading-large': ['1.875rem', { lineHeight: '1.875rem', fontWeight: '700' }], // 30px
        'body-large': ['1.25rem', { lineHeight: '2.375rem', fontWeight: '400' }], // 20px, 38px
        'body-medium': ['1.125rem', { lineHeight: '1.75rem', fontWeight: '400' }], // 18px, 28px
        'body-small': ['1rem', { lineHeight: '1rem', fontWeight: '500' }], // 16px
        caption: ['0.875rem', { lineHeight: '0.875rem', fontWeight: '400' }], // 14px
        'caption-medium': ['0.875rem', { lineHeight: '0.875rem', fontWeight: '500' }], // 14px
        label: ['1rem', { lineHeight: '1rem', fontWeight: '600' }], // 16px
      },
      spacing: {
        2.5: '0.625rem', // 10px
        4: '1rem', // 16px
        6: '1.5rem', // 24px
        9: '2.25rem', // 36px
        16: '4rem', // 64px
        'content-max-width': '426px',
        'content-margin-top': '135px',
      },
      borderRadius: {
        md: '0.375rem', // 6px
      },
      boxShadow: {
        soft: '0px 4px 14px 1px #0000000A',
        medium: '0px 4px 10px 3px #0000001C',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.4s ease-out',
        'slide-left': 'slideLeft 0.3s ease-out',
        'slide-right': 'slideRight 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-primary': 'linear-gradient(to bottom right, #4F46E5, #7C3AED)',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
