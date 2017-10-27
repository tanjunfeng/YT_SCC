/**
 * @file webpack.config.pro.js
 * @author denglingbo
 *
 */

const path = require('path');
const HtmlWebPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
// const webpack = require('webpack');

// 调用 framework
const makeWebpack = require('freed-spa/make-webpack.config');

const ROOT_PATH = path.resolve(__dirname);
// const ENV = process.env.NODE_ENV;
// const CONF = process.env.CONF;
// const __PRO__ = ENV === 'production';

const publicPath = '/';
const staticPath = '/';

// if (__PRO__) {
//     publicPath = '';
//     staticPath = '';
// }

const webpackConfig = makeWebpack({
    entry: {
        common: ['moment', 'core-js'],
        index: './src/index',
    },
    output: {
        path: path.resolve(ROOT_PATH, './dist/'),
        publicPath,
        filename: '[name].[hash].js',
        chunkFilename: '[name].[chunkhash].chunk.js'
    },
    plugins: [
        new HtmlWebPlugin({
            filename: 'index.html',
            template: './src/index.html',
            chunks: ['common', 'vendor', 'index'],
            inject: 'body',
            staticPath,
        }),

        // to: 实际为 path/xxx
        new CopyPlugin([
            {
                from: './lib/',
                to: './lib/',
                force: false,
            }
        ]),

        new CleanWebpackPlugin(['dist'], {
            root: path.join(ROOT_PATH, '/')
        })
    ],
    resolve: {
        modules: [
            path.resolve(ROOT_PATH, 'node_modules'),
            path.join(ROOT_PATH, './src'),
        ]
    },

    externals: {
        immutable: 'Immutable',
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
