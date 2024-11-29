import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		colors: {
			pink: '#E5C2C0',
			bordeau: {
				100: '#F9EAE8',
				200: '#F4D4D0',
				300: '#E9A9A3',
				400: '#E07F77',
				500: '#603140',
				600: '#C44B41',
				700: '#A63D35',
				800: '#8A3029',
				900: '#702520'
			},
			blue: '#A6E1FA',
			ocean: '#5296A5',
			black: '#000000',
			white: '#FFFFFF',
			gray: {
				100: '#F7F7F7',
				200: '#E5E5E5',
				300: '#D4D4D4',
				400: '#A3A3A3',
				500: '#737373',
				600: '#525252',
				700: '#404040',
				800: '#262626',
				900: '#171717'
			},
			indigo: {
				100: '#E0E8F9',
				200: '#BED0F7',
				300: '#98AEEB',
				400: '#7B93DB',
				500: '#647ACB',
				600: '#4C63B6',
				700: '#4055A8',
				800: '#35469C',
				900: '#2D3A8C'
			},
			red: {
				100: '#FEE2E2',
				200: '#FECACA',
				300: '#FCA5A5',
				400: '#F87171',
				500: '#EF4444',
				600: '#DC2626',
				700: '#B91C1C',
				800: '#991B1B',
				900: '#7F1D1D'
			}
		},
		extend: {
			spacing: {
				'128': '32rem'
			}
		}
	},

	plugins: [require('@tailwindcss/typography')]
} as Config;
