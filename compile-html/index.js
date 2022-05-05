import fs from 'fs';
import path, { dirname } from 'path';
import { allFonts, fontsCss } from './fonts.js';
import { config as loaderConfig, loaders } from './loader.js';
import { fileURLToPath } from 'url';

const cwd = dirname(fileURLToPath(import.meta.url));
const loader = loaders.filter((loader, index) => {
	return (index === loaderConfig.type) ? true : false;
})[0];

const compile = async function(options) {
	const {
		dev,
		filePath
	} = {
		dev: false,
		filePath: path.join(cwd, 'index.html'),
		...(options || {})
	};
	const fontfaceobserver = await fs.promises.readFile(path.join(cwd, 'fontfaceobserver.js'));
	const html = `<!doctype html>
	<html>
		<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta name="theme-color" content="${loaderConfig.backgroundColor}">
		<meta name="msapplication-navbutton-color" content="${loaderConfig.backgroundColor}">
		<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
		<meta name="apple-mobile-web-app-capable" content="yes">
		${dev ? (
		`<script src="//cdn.jsdelivr.net/npm/eruda"></script>
		<script>eruda.init();</script>`
		) : ''}
		<style>
			${fontsCss}
			html, body {
				width: 100%;
				height: 100%;
			}
			body {
				margin: 0px;
				font-family: Nunito;
			}
			#root {
				width: 100%;
				height: 100%;
				overflow: auto; 
			}
			${loader.css(loaderConfig)}
			#loader-o-container {
				position: fixed;
				width: 100%;
				height: 100%;
				z-index: 2;
			}
			#loader-i-wrapper {
				position: relative;
				display: block;
				width: 100%;
				height: 100%;
			}
			#loader-i-container {
				position: absolute;
				width: 100%;
				height: 100%;
				display: flex;
				justify-content: center;
				align-items: center;
				z-index: 2;
			}
			#loader-background {
				position: absolute;
				width: 100%;
				height: 100%;
				z-index: 1;
				background-color: ${loaderConfig.backgroundColor};
				opacity: ${loaderConfig.backgroundOpacity};
			}
			#root {
				width: 100%;
				height: 100%;
			}
		</style>
		</head>
		<body>
			<div id="loader-o-container">
				<div id="loader-i-wrapper">
					<div id="loader-background"></div>
					<div id="loader-i-container">
						${loader.html(loaderConfig)}
					</div>
				</div>
			</div>
			<div id="root"></div>
			<script>
				(function() {
					const rootLoader = {
						oContainer: document.getElementById('loader-o-container')
					};
					rootLoader.show = (function() {
						this.oContainer.style.display = 'flex';
					}).bind(rootLoader);
					rootLoader.hide = (function() {
						this.oContainer.style.display = 'none';
					}).bind(rootLoader);
					window.rootLoader = rootLoader;
				})()
			</script>
			<script>
				${fontfaceobserver}
			</script>
			<script>
				(function() {
					var loadFont = function() {
						var loadFontCSS = function(fontInfo) {
							return new Promise(function(resolve, reject) {
								if (!fontInfo.cssURL) {
									resolve();
									return;
								}
								var link = document.createElement('link');
								link.href = fontInfo.cssURL;
								link.rel = 'stylesheet';
								return new Promise(function(resolve, reject) {
									link.onload = resolve;
									link.onerror = reject;
									document.head.appendChild(link);
								}).then(resolve)
								.catch(reject);
							});
						}
						var fonts = JSON.parse('${JSON.stringify(allFonts)}');
						if (document.fonts) {
							return Promise.all(
								fonts.map(function(fontInfo) {
									return loadFontCSS(fontInfo)
									.then(function() {
										return document.fonts.load('16px "' + fontInfo.family + '"', 6000);
									}).then(function() {
										if (document.fonts.check('16px "' + fontInfo.family + '"')) {
											return;
										}
										throw 'Font ' + fontInfo.family + ' failed to load.';
									});
								})
							);
						}
						return Promise.all(
							fonts.map(function(fontInfo) {
								return loadFontCSS(fontInfo)
								.then(function() {
									var font = new FontFaceObserver(fontInfo.family);
									return font.load();
								});
							})
						);
					}
					Promise.all([
						loadFont(),
						(function() {
							var link = document.createElement('link');
							link.rel = 'stylesheet';
							link.href = '/css/main.css?gzip=true';
							return new Promise(function(resolve, reject) {
								link.onload = function() {
									console.log('Main CSS bundle loaded successfully');
									resolve();
								}
								link.onerror = reject;
								document.head.appendChild(link);
							});
						})(),
						(function() {
							var script = document.createElement('script');
							script.type = 'text/javascript';
							script.src = '/js/main.js?gzip=true';
							return new Promise(function(resolve, reject) {
								script.onload = function() {
									console.log('Main JS bundle loaded successfully');
									resolve();
								}
								script.onerror = reject;
								document.head.appendChild(script);
							});
						})()
					]).then(function() {
						console.log('Initial resources have been successfully loaded.');
						if (typeof(window.onInitialContentLoad) === 'function') {
							try {
								window.onInitialContentLoad();
							} catch(error) {
								console.error(error);
							}
						}
					}).catch(function(error) {
						console.warn('An error occurred while resources were being loaded.');
						console.error(error);
					});
				})();
			</script>
		</body>
	</html>`;
	await fs.promises.writeFile(filePath, html);
	return html;
};

export default compile;


/*
\uf240
*/