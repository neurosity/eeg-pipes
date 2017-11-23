const path = require('path');

const library = 'EEGPipes';
const libraryFileName = 'eeg-pipes';

const config = {
    entry: './src/index.js',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    },
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
            library,
            libraryTarget
        }
    });

module.exports = [
    exportLibraryTarget('umd'),
    exportLibraryTarget('var'),
];