/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js,ts,jsx,tsx}'],
	theme: {
		extend: {
			screens: {
				max_2xl: { max: '1536px' }, // laptop_lg, desktop
				max_xl: { max: '1280px' }, // laptop
				max_lg: { max: '1024px' }, // laptop_sm, tablet_lg
				max_md: { max: '768px' }, // tablet

				max_m_xl: { max: '430px' }, // iPhone Pro Max, Pixel C
				max_m_lg: { max: '415px' }, // iPhone Pro, Pixel XL ***
				max_m_md: { max: '375px' }, // iPhone, Samsung Galaxy ***
				max_m_sm: { max: '320px' }, // iPhone (older)
			},
			margin: {
				micro: 'calc(1em / (1.618 * 1.618 * 1.618))', // 1em / scaleFactor^3
				tiny: 'calc(1em / (1.618 * 1.618))', // 1em / scaleFactor^2
				small: 'calc(1em / 1.618)', // 1em / scaleFactor
				medium: '1em', // base size
				large: 'calc(1em * 1.618)', // 1em * scaleFactor
				big: 'calc(1em * 1.618 * 1.618)', // 1em * scaleFactor^2
				huge: 'calc(1em * 1.618 * 1.618 * 1.618)', // 1em * scaleFactor^3
			},
		},
	},
	plugins: [],
}
