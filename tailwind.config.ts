import plugin from 'tailwindcss/plugin'
import type { Config } from 'tailwindcss'

const config: Config = {
	content: ['./src/{app,ui}/**/*.{ts,tsx}'],
	theme: {
		extend: {
			colors: {
				ink: '#000',
				canvas: '#fff',
				background: '#2C3E50',
				white: '#ffffff',
				tahiti: {
					100: '#cffafe',
					200: '#a5f3fc',
					300: '#67e8f9',
					400: '#22d3ee',
					500: '#06b6d4',
					600: '#0891b2',
					700: '#0e7490',
					800: '#155e75',
					900: '#164e63',
				},
				accent: '#000',
			},
			fontFamily: {
				moncheri: ['TAN-MONCHERI', 'sans-serif'],
			},
			maxHeight: {
				fold: 'calc(100svh - var(--header-height))',
			},
		},
	},
	plugins: [
		plugin(function ({ addVariant }) {
			addVariant('header-open', 'body:has(#header-open:checked) &')
			addVariant('header-closed', 'body:has(#header-open:not(:checked)) &')
		}),
	],
	safelist: [{ pattern: /action.*/ }, 'ghost'],
}

export default config
