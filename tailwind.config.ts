import plugin from 'tailwindcss/plugin'
import type { Config } from 'tailwindcss'

const config: Config = {
	darkMode: ['class'],
	content: [
		'./src/{app,ui,styles}/**/*.{ts,tsx,css}',
		'./src/**/*.{ts,tsx,css}',
	],
	theme: {
		screens: {
			sm: '640px',
			md: '768px',
			lg: '1024px',
			xl: '1280px',
			'2xl': '1536px',
		},
		extend: {
			colors: {
				ink: '#000',
				canvas: '#fff',
				background: 'hsl(var(--background))',
				white: '#ffffff',
				almostBlack: '#030303',
				tahiti: {
					'100': '#cffafe',
					'200': '#a5f3fc',
					'300': '#67e8f9',
					'400': '#22d3ee',
					'500': '#06b6d4',
					'600': '#0891b2',
					'700': '#0e7490',
					'800': '#155e75',
					'900': '#164e63',
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
				},
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))',
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))',
				},
			},
			fontFamily: {
				moncheri: ['TAN-MONCHERI', 'sans-serif'],
			},
			maxHeight: {
				fold: 'calc(100svh - var(--header-height))',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
			keyframes: {
				'slide-up': {
					'0%': { transform: 'translateY(100%)' },
					'100%': { transform: 'translateY(0)' },
				},
			},
			animation: {
				'slide-up': 'slide-up 0.3s ease-out',
			},
		},
	},
	plugins: [
		plugin(function ({ addVariant, addUtilities }) {
			// Add custom variants for header-open and header-closed
			addVariant('header-open', 'body:has(#header-open:checked) &')
			addVariant('header-closed', 'body:has(#header-open:not(:checked)) &')

			// Add custom utilities with mobile Safari and Chrome fixes
			addUtilities({
				'.frosted-glass': {
					'@apply backdrop-blur-sm': {},
					'-webkit-backdrop-filter': 'blur(4px)',
					'@media (max-width: 1024px)': {
						'-webkit-backdrop-filter': 'blur(4px)',
						'backdrop-filter': 'blur(4px)',
						'background-color': 'rgba(255, 255, 255, 0.1)',
					},
				},
				'.frosted-glass-dark': {
					'@apply backdrop-blur-sm': {},
					'-webkit-backdrop-filter': 'blur(4px)',
					'@media (max-width: 1024px)': {
						'-webkit-backdrop-filter': 'blur(4px)',
						'backdrop-filter': 'blur(4px)',
						'background-color': 'rgba(0, 0, 0, 0.1)',
					},
				},
			})
		}),
		require('tailwindcss-animate'),
	],
	safelist: [
		{ pattern: /action.*/ },
		'ghost',
		'frosted-glass',
		'_btn',
		'bg-hover',
	],
}

export default config
