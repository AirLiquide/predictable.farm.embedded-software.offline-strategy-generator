var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname);
var APP_DIR = path.resolve(__dirname);

var fs = require('fs');
var nodeModules = {};

fs.readdirSync('node_modules')
    .filter(function(x) {
        return ['.bin'].indexOf(x) === -1;
    })
    .forEach(function(mod) {
        nodeModules[mod] = 'commonjs ' + mod;
    });

var config = {
    entry: APP_DIR + '/index.js',
    target :'node',
    output: {
        path: BUILD_DIR,
        filename: 'bundle.js'
    },
    module : {
        loaders : [
            {
                test: /(\.md|\.map)$/,
                loader: 'null-loader'
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            }
        ]
    },
    externals: nodeModules,
};

module.exports = config;