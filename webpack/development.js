import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import ESLintPlugin from "eslint-webpack-plugin";
import autoprefixer from 'autoprefixer';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import htmlCompiler from './../compile-html/index.js';

const require = createRequire(import.meta.url);
const cwd = dirname(fileURLToPath(import.meta.url));
const environment = 'development';
const port = 5555;
const srcdir = path.join(cwd, '..', 'src');
const distdir = path.join(cwd, '..', 'dist');

htmlCompiler({
	filePath: path.join(distdir, 'index.html'),
	dev: true
}).then(() => {
	console.log('HTML compiled successfully');
});

const getConfig = function() {
	return {
		entry: [
			require.resolve('regenerator-runtime/runtime.js'),
			srcdir + '/index.tsx'
		],
		mode: environment,
		module: {
			rules: [
				{
					test: /\.(js|jsx)$/,
					exclude: /node_modules/,
					loader: 'babel-loader',
					options: {
						presets: ['@babel/env', '@babel/preset-react']
					}
				},
				{
					test: /\.(ts|tsx)$/,
					loader: 'ts-loader',
					exclude: /node_modules/,
					options: {
						transpileOnly: true
					}
				},
				{
					test: /\.((png)|(jpeg)|(jpg)|(ttf)|(otf)|(woff)|(woff2)|(ico)|(svg)|(eot)|(pdf)|(csv))$/,
					loader: 'file-loader',
					options: {
						esModule: false,
						name: (resourcePath, resourceQuery) => {
							if (/\.((png)|(jpeg)|(jpg)|(ico)|(svg))$/.test(resourcePath)) {
								return 'images/[name].[ext]';
							}
							else if (/\.((ttf)|(otf)|(woff)|(woff2)|(ico)|(svg)|(eot))$/.test(resourcePath)) {
								return 'fonts/[name].[ext]';
							}
							return 'others/[name].[ext]';
						}
					}
				},
				{
					test: /\.((s[ac])|c)ss$/,
					use: [
						{
							loader: MiniCssExtractPlugin.loader
						},
						{
							loader: 'css-loader',
							options: {
								url: false
							}
						},
						{
							loader: 'resolve-url-loader'
						},
						{
							loader: 'postcss-loader',
							/*
							options: {
								postcssOptions: {
									plugins: [
										autoprefixer()
									]
								}
							}
							*/
						}
					]
				}
			]
		},
		resolve: {
			extensions: ['*', '.js', '.jsx', '.ts', '.tsx'],
			alias: {
				'react': 'preact/compat',
				'react-dom/test-utils': 'preact/test-utils',
				'react-dom': 'preact/compat',
				'react/jsx-runtime': 'preact/jsx-runtime'
			},
			plugins: [
				new TsconfigPathsPlugin({
					configFile: path.join(cwd, '..', 'tsconfig.json')
				})
			]
		},
		output: {
			path: distdir,
			publicPath: '/',
			chunkFilename: `js/[name].js`,
			filename: `js/[name].js`
		},
		devServer: {
			historyApiFallback: {
				index: `index.html`
			},
			host: '0.0.0.0',
			port: parseInt(port),
			static: [
				{
					directory: distdir,
					watch: true
				}
			],
			liveReload: true,
			watchFiles: [
				`${srcdir}/**/*`
			]
		},
		plugins: [
			new webpack.HotModuleReplacementPlugin({
				hot: true
			}),
			new ForkTsCheckerWebpackPlugin({
				typescript: {
					mode: 'write-references',
					build: true
				}
			}),
			new ESLintPlugin({
				extensions: ["js", "jsx", "ts", "tsx"],
			}),
			new MiniCssExtractPlugin({
				chunkFilename: `css/[name].css`,
				filename: () => `css/[name].css`
			}),
			new webpack.DefinePlugin({
				'process.env.APP_ENV': JSON.stringify(environment),
				'process.env.DEV_PORT': JSON.stringify(port)
			})
		]
	}
}
try {
	console.log('Starting webpack development server...');
	const config = getConfig();
	const webpackInstance = webpack(config);
	const server = new WebpackDevServer(webpackInstance, config.devServer);
	server.listen(
		parseInt(port),
		config.devServer.host,
		err => {
			if (err) {
				console.log(err);
				process.exit(1);
			}
			console.log(`Webpack development server is listening on port ${port}`);
		}
	);
} catch(err) {
	console.log(err.stack);
}
