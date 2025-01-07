import type { Config } from 'tailwindcss';

const config: Config = {
    darkMode: ['class'],
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            container: {
                center: true,
                padding: '2rem',
                screens: {
                    sm: '100%',
                    md: '768px',
                    lg: '1024px',
                    xl: '1280px',
                },
            },
            backgroundColor: {
                'black-01': 'rgba(0, 0, 0, 0.1)',
                'black-05': 'rgba(0, 0, 0, 0.5)',
            },
            keyframes: {
                bounceUp: {
                    '0%': { transform: 'translateY(100%)', opacity: '0' },
                    '50%': { transform: 'translateY(-10%)', opacity: '1' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                bounceDown: {
                    '0%': { transform: 'translateY(-100%)', opacity: '0' },
                    '50%': { transform: 'translateY(10%)', opacity: '1' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
            },
            animation: {
                'bounce-up': 'bounceUp 0.3s ease-out',
                'bounce-down': 'bounceDown 0.3s ease-out',
            },
        },
    },
    plugins: [require('tailwindcss-animate'), require('@tailwindcss/line-clamp')],
};

export default config;
