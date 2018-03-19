const path = require('path');
const webpackRxjsExternals = require('webpack-rxjs-externals');
const nodeExternals = require('webpack-node-externals');

const library = 'EEGPipes';
const libraryFileName = 'eeg-pipes';

const config = {
    entry: {
        main: './src/index.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.csv$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'csv-loader',
                    options: {
                        dynamicTyping: true,
                        header: false,
                        skipEmptyLines: true
                    }
                }
            }
        ]
    },
    externals: [
        nodeExternals({}),
        webpackRxjsExternals()
    ],
    devtool: 'eval',
    devServer: {
        compress: true,
        port: 9000
    }
};

const exportLibraryTarget = libraryTarget => 
    Object.assign({}, config, {
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: `${libraryFileName}.${libraryTarget}.js`,
            chunkFilename: `${libraryFileName}.[name].${libraryTarget}.js`,
            library,
            libraryTarget,
            globalObject: 'this'
        }
    });

module.exports = [
    exportLibraryTarget('umd'),
    exportLibraryTarget('var'),
];