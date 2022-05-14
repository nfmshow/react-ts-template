const Color = require('color');

function generateShades(c) {
	const color = Color(c);
	const white = Color('#ffffff');
	return {
		'50': color.mix(white, 1 - 0.05).hex(),
		'100': color.mix(white, 1 - 0.1).hex(),
		'200': color.mix(white, 1 - 0.2).hex(),
		'300': color.mix(white, 1 - 0.3).hex(),
		'400': color.mix(white, 1 - 0.4).hex(),
		'500': color.mix(white, 1 - 0.5).hex(),
		'600': color.mix(white, 1 - 0.6).hex(),
		'700': color.mix(white, 1 - 0.7).hex(),
		'800': color.mix(white, 1 - 0.8).hex(),
		'900': color.mix(white, 1 - 0.9).hex() 
	}
}

module.exports = {
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,jsx,ts,tsx}'
	],
	theme: {
		extend: {
			colors: {
				primary: generateShades('#A52A2A'),
				secondary: generateShades('#A52A2A')
			},
			fontFamily: {
				nunito: ['Nunito', 'sans-serif'],
				icomoon: ['Icomoon']
			},
			animation: {
				'bounce-small': 'bounce-small 1s infinite'
			}
		}
	},
	plugins: [],
};

