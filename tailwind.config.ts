import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		colors: {
			pink: '#E5C2C0',
			bordeau: '#603140',
			blue: '#A6E1FA',
			ocean: '#5296A5',
			black: '#000000',
			white: '#FFFFFF',
			gray: '#C4C4C4'
		},
		extend: {}
	},

	plugins: [require('@tailwindcss/typography')]
} as Config;
