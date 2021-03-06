/**
 * @file server.js
 * @author denglingbo
 */

var path = require('path');
var LocalServer = require('freed-spa/tool/server');

var ROOT_PATH = path.resolve(__dirname);

const __TEST__ = process.env.CONF === 'test';

var host = '';
var localConfig = {};

var rules = [];

// 联调环境szz
if (__TEST__) {
    host = 'sitxcsc-static.yatang.com.cn';
    rules = [{
        pattern: /https?:\/\/[-\w\.]*(?::\d+)?\/(.+)/,
        responder: 'http://sitxcsc.yatang.com.cn/$1',
        // responder: 'http://172.30.49.7:8899/$1',
    }];
} else {
    host = 'localhost';
    rules = [{
        pattern: /https?:\/\/[\w\.]*(?::\d+)?\/.+\/(\w+)*/,
        responder: path.join(ROOT_PATH, '../mock/') + '$1.json'
    }];
}

var proxyConfig = {
    port: 9999,
    rules: rules
};

var devConfig = {
    host: host,
    port: 8899,
    proxy: {
        '/api': `http://${host}:${proxyConfig.port}`,
        '/sc': `http://${host}:${proxyConfig.port}`,
    }
};

localConfig.proxyConfig = proxyConfig;
localConfig.devConfig = devConfig;

LocalServer(localConfig);
