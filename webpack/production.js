const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');


global.__srcdir = path.join( __dirname, '/../../subdomains/www');
global.__distdir = path.join( __dirname, '/../../public');

fs.readdir(__distdir + '/js/'), { withFileTypes: true }, (err, subdirs) => {
	subdirs.forEach(subdir => {
		try {
			if (subdir.isDirectory() || !(/^lazy\-.*portal.*$/.test(subdir.name))) {
				return;
			}
			fs.unlinkSync(__distdir + '/js/' + subdir.name);
		}
		catch(err) {
			console.warn(err);
		}
	});
});

module.exports = {
	entry: [
		require.resolve('regenerator-runtime/runtime.js'),
		'./src/index.js'
	],
	mode: 'production',
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
				test: /\.((png)|(jpeg)|(jpg)|(ttf)|(otf)|(woff)|(woff2)|(ico)|(svg)|(eot))$/,
				loader: 'file-loader',
				options: {
					name: (resourcePath, resourceQuery) => {
						if (/\.((png)|(jpeg)|(jpg)|(ico))$/.test(resourcePath)) {
							return 'assets/images/[name].[ext]';
						}
						else if (/\.((ttf)|(otf)|(woff)|(woff2)|(ico)|(svg)|(eot))$/.test(resourcePath)) {
							return 'assets/fonts/[name].[ext]';
						}
						return 'assets/others/[name].[ext]';
					},
					esModule: false
				}
			},
			{
				test: /\.((s[ac])|c)ss$/,
				exclude: /^.*ckeditor5.*$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader
					},
					{
						loader: 'css-loader',
						options: {
							url: false,
							publicPath: publicPath
						}
					},
					{
						loader: 'resolve-url-loader'
					},
					{
						loader: 'postcss-loader',
						options: {
							postcssOptions: {
								plugins: [
									'autoprefixer'
								]
							}
						}
					},
					{
						loader: 'sass-loader',
						options: {
							sourceMap: true
						}
					}
				]
			},
			{
				test: /ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/,
				use: ['raw-loader']
			},
			{
				test: /ckeditor5-[^/\\]+[/\\]theme[/\\].+\.css$/,
				use: [
					{
						loader: 'style-loader',
						options: {
							injectType: 'singletonStyleTag',
							attributes: {
								'data-cke': true
							}
						}
					},
					{
						loader: 'postcss-loader',
						options: styles.getPostCssConfig({
							themeImporter: {
								themePath: require.resolve('@ckeditor/ckeditor5-theme-lark')
							},
							minify: true
						})
					}
				]
			}
		]
	},
	resolve: {
		extensions: ['*', '.js', '.jsx'],
		alias: {
			'react': 'preact/compat',
			'react-dom': 'preact/compat'
		}
	},
	output: {
		path: path.resolve(__dirname, outputPath),
		publicPath: publicPath,
		chunkFilename: 'js/[name].[contentHash].lampnets-chunk.js',
		filename: 'js/[name].lampnets-bundle.js'
	},
	optimization: {
		minimize: true,
		splitChunks: {
			chunks: (chunk) => {
				return false
			}
		},
		minimizer: [
			new TerserPlugin({
				test: /\.js/
			}),
			new OptimizeCSSAssetsPlugin({
				cssProcessorOptions: {
					safe: true,
					discardComments: {
						removeAll: true
					},
					autoPrefixer: {
						disable: false
					}
				}
			})
		]
	},
	plugins: [
		new MiniCssExtractPlugin({
			chunkFilename: 'css/[name].[contenthash].lampnets-chunk.css',
			moduleFilename: () => 'css/[name].lampnets-bundle.css'
		}),
		/*
		new BundleAnalyzerPlugin({
			statsFileName: __dirname + '/../stats.json', //Relative to output.path
			generateStatsFile: false
		}),
		*/
		new CompressionPlugin({
			test: /\.(js)|(css)$/,
			algorithm: 'gzip',
			compressionOptions: {
				level: 9
			}
		})/*
		new CKEditorWebpackPlugin({
            
        })*/
	]
}