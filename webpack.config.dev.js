/**
 * @file webpack.config.dev.js
 * @author denglingbo
 *
 */
const path = require('path');
const HtmlWebPlugin = require('html-webpack-plugin');
// const webpack = require('webpack');
// const CopyPlugin = require('copy-webpack-plugin');

// 调用 framework
const makeWebpack = require('freed-spa/make-webpack.config');

const ROOT_PATH = path.resolve(__dirname);
// const ENV = process.env.NODE_ENV;
// const CONF = process.env.CONF;

const webpackConfig = makeWebpack({
    entry: {
        common: ['moment', 'core-js', 'immutable'],
        index: './src/index',
    },
    output: {
        path: path.resolve(ROOT_PATH, './dist/'),
        publicPath: '/',
        filename: '[name].[hash].js',
        chunkFilename: '[name].[chunkhash].chunk.js'
    },
    plugins: [
        new HtmlWebPlugin({
            filename: 'index.html',
            template: './src/index.dev.html',
            chunks: ['common', 'vendor', 'index'],
            inject: 'body',
        }),
    ],
    resolve: {
        modules: [
            path.resolve(ROOT_PATH, 'node_modules'),
            path.join(ROOT_PATH, './src'),
        ]
    },

    module: {
        rules: [
            {
                // 图片加载器
                test: /\.(png|jpg|gif|ttf|eot|svg|woff(2)?)(\?[=a-z0-9]+)?$/,
                loader: 'url-loader?limit=10000&name=images/[hash].[ext]'
            }
        ]
    }
});

module.exports = webpackConfig;
