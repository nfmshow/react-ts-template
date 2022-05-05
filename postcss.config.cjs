const autoprefixer = require("autoprefixer");
const tailwindConfig = require("./tailwind.config.cjs");
const tailwind = require("tailwindcss");

module.exports = {
	plugins: [
		tailwind,
		tailwindConfig,
		autoprefixer
	]
};
