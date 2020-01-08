'use strict';
/* global require module __dirname */
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractCssChunksPlugin = require('extract-css-chunks-webpack-plugin');
const path = require('path');
const webpack = require('webpack');
const common = require('./webpack.common');
const postcssPresetenv = require('postcss-preset-env');

module.exports = merge(common, {
    mode: 'development',
    entry: [
        'webpack-hot-middleware/client?path=/__webpack_hmr'
    ],
    target: 'web',
    devtool: '#sourcemap',
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
                        presets: ['@babel/preset-env']
                    },
                }
            },
            {
                test: /\.scss/,
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
                test: /\.ejs$/,
                use: ['html-loader', 'ejs-html-loader']
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
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            template: './src/views/pages/index.ejs',
            filename: './index.html',
            chunks: ['main']
        }),
        new HtmlWebpackPlugin({
            template: './src/views/pages/offers.ejs',
            filename: './offers.html',
            chunks: ['offers']
        }),
        new ExtractCssChunksPlugin({
            filename: 'assets/css/[name].css',
            chunkFilename: 'assets/css/[id].css'
        })
    ]
});