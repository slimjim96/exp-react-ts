const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const outputDirectory = 'dist';

module.exports = {
    entry: ['babel-polyfill', './src/bp-emp-rx-app/index.tsx'],
    output: {
        path: path.join(__dirname, outputDirectory),
        filename: './js/[name].bundle.js'
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'ts-loader'
                    },
                ],
                exclude: /node_modules/
            },
            {
                enforce: 'pre',
                test: /\.js$/,
                loader: 'source-map-loader'
            },
            {
                test: /\.less$/,
                use: [
                    { loader: 'style-loader' },
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: './Less',
                            hmr: process.env.NODE_ENV === 'development',
                        },
                    },
                    { loader: 'css-loader' },
                    {
                        loader: 'less-loader',
                        options: {
                            strictMath: true,
                            noIeCompat: true,
                            importLoaders: true
                        }
                    },
                ]
            },
            {
                test: /\.(jpe?g|png|gif|woff|woff2|otf|eot|ttf|svg)(\?[a-z0-9=.]+)?$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 1000,
                            name : 'assets/img/[name].[ext]'
                        }
                    }
                ]
            },
        ]
    },
    resolve: {
        extensions: ['*', '.ts', '.tsx', '.js', '.jsx', '.json', '.less']
    },
    devServer: {
        open: true,
        hot: true,
        proxy: {
            '/api/**': {
                target: 'http://localhost:3000',
                secure: false,
                changeOrigin: true
            }
        }
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: './public/index.html',
            favicon: './public/favicon.ico',
            title: 'express-typescript-react',
        }),
        new MiniCssExtractPlugin({
            filename: './css/[name].css',
            chunkFilename: './css/[id].css',
        })
        // new CopyPlugin({
        //     patterns: [{from: './src/bp-emp-rx-app/Assets', to: 'assets'}],
        // })
    ],
};
