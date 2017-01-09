import webpack from 'webpack';
import { baseConfig, ROOT_PATH } from './webpack.base';

const { version } = require(`${ROOT_PATH}/package.json`);

export default Object.assign(baseConfig, {
    entry: [`${ROOT_PATH}/lib/DashjsBundle.js`],

    output: {
        library: [
            'DashjsP2PBundle'
        ],
        libraryTarget: 'umd',
        path: `${ROOT_PATH}/dist/bundle`,
        filename: 'dashjs-p2p-bundle.js',
    },

    plugins: [
        new webpack.DefinePlugin({
            _VERSION_: JSON.stringify(version),
        }),
    ]
});
