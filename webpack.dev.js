'use strict';
require('dotenv').config({
    path: './process.env'
});
const merge = require('webpack-merge');
const path = require('path');
const common = require('./webpack.common');
const postcssPresetenv = require('postcss-preset-env');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractCssChunksPlugin = require('extract-css-chunks-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

module.exports = merge(common, {
    mode: 'development',
    entry: {
        home: './src/assets/js/home.js',
        about: './src/assets/js/about.js',
        booking: './src/assets/js/booking.js',
        contact: './src/assets/js/contact.js',
        locations: './src/assets/js/locations.js',
        menu: './src/assets/js/menu.js',
        offers: './src/assets/js/offers.js',
        spices: './src/assets/js/spices.js',
        takeout: './src/assets/js/takeout.js',
        terms: './src/assets/js/terms.js',
    },
    target: 'web',
    devtool: 'eval-source-map',
    module: {
        rules: [{
                enforce: "pre",
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "eslint-loader",
                options: {
                    emitWarning: true,
                    failOnError: false,
                    failOnWarning: false
                }
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: ['@babel/plugin-transform-runtime']
                    },
                }
            },
            {
                test: /(?<!\.ce)\.scss$/,
                use: [{
                        loader: ExtractCssChunksPlugin.loader,
                        options: {
                            hot: true
                        }
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                            importLoaders: 1
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            indent: 'postcss',
                            plugins: () => postcssPresetenv(),
                            sourceMap: 'inline'
                        },
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
                test: /\.ce\.scss$/,
                use: ['css-loader', {
                        loader: 'postcss-loader',
                        options: {
                            indent: 'postcss',
                            plugins: () => postcssPresetenv(),
                            sourceMap: 'inline'
                        },
                    },
                    'sass-loader'
                ]
            },
            {
                test: /\.(ttf|woff|woff2|eot)/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        publicPath: path.resolve(__dirname, '/assets/webfonts'),
                        outputPath: 'assets/webfonts',
                        name: '[name].[ext]',
                        esModule: false
                    }
                }]
            },
            {
                test: /\.(jpeg|jpg|svg|gif|png)/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        publicPath: path.resolve(__dirname, '/assets/img'),
                        outputPath: 'assets/img',
                        name: '[name].[ext]',
                        esModule: false
                    }
                }]
            }
        ]
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
        filename: 'assets/js/[name].[hash].js'
    },
    plugins: [
        new BrowserSyncPlugin({
            files: '**/*.ejs',
            proxy: `https://localhost:${process.env.PORT}`
        }),
        new HtmlWebpackPlugin({
            template: '!!ejs-webpack-loader!./src/views/pages/index.ejs',
            filename: './index.html',
            page: 'Burlington',
            chunks: ['home']
        }),
        new HtmlWebpackPlugin({
            template: '!!ejs-webpack-loader!./src/views/pages/offers.ejs',
            filename: './offers.html',
            chunks: ['offers']
        }),
        new HtmlWebpackPlugin({
            template: '!!ejs-webpack-loader!./src/views/pages/menu.ejs',
            filename: './menu.html',
            chunks: ['menu']
        }),
        new HtmlWebpackPlugin({
            template: '!!ejs-webpack-loader!./src/views/pages/about.ejs',
            filename: './about.html',
            chunks: ['about']
        }),
        new HtmlWebpackPlugin({
            template: '!!ejs-webpack-loader!./src/views/pages/takeout.ejs',
            filename: './takeout.html',
            chunks: ['takeout']
        }),
        new HtmlWebpackPlugin({
            template: '!!ejs-webpack-loader!./src/views/pages/booking.ejs',
            filename: './booking.html',
            chunks: ['booking']
        }),
        new HtmlWebpackPlugin({
            template: '!!ejs-webpack-loader!./src/views/pages/locations.ejs',
            filename: './locations.html',
            page: 'Locations',
            data: require('./src/assets/json/branches.js'),
            chunks: ['locations']

        }),
        new ExtractCssChunksPlugin({
            filename: 'assets/css/[name].css',
            chunkFilename: 'assets/css/[id].css'
        })
    ]
});