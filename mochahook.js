require('should');
require('babel-core/register')({
    ignore: /node_modules/,
});
window = global;

global.dashjs = {
    MediaPlayer: {
        events: {
            QUALITY_CHANGE_START: 'QUALITY_CHANGE_START',
            STREAM_INITIALIZED: 'STREAM_INITIALIZED',
            FRAGMENT_LOADING_ABANDONED: 'FRAGMENT_LOADING_ABANDONED',
        },
    },
};
