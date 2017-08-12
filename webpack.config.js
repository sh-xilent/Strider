const path = require('path');

module.exports = {
    entry: {
        'babel-polyfill': 'babel-polyfill',
        'strider-utils': './strider-utils/src/scripts/strider-utils.js',
        'strider-core-injection': './strider-core/strider-core-injection/src/scripts/strider-core-injection.js',
        'strider-core-http': './strider-core/strider-core-http/src/scripts/strider-core-http.js'
    },
    output: {
        path: path.resolve(__dirname, './dist/scripts'),
        filename: '[name]/[name].js',
    },
    resolve: {
        modules: [
            path.resolve(__dirname, './strider-utils/src/scripts'),
            path.resolve(__dirname, './strider-core/strider-core-injection/src/scripts'),
            path.resolve(__dirname, './strider-core/strider-core-http/src/scripts'),
            path.resolve(__dirname, './node_modules')
        ]
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader?presets[]=es2015'
            }
        ]
    }
};