/* eslint new-cap: ["error", { "capIsNew": false }]*/

import {MediaPlayer} from 'dashjs';
import DashjsWrapper from './DashjsWrapper';

function MediaPlayerWrapper(context, p2pConfig) {
    const liveDelay = 30;
    let player = MediaPlayer(context).create();

    new DashjsWrapper(player, p2pConfig, liveDelay);

    // Note: We will evaluate to player instance even when used as a constructor
    return player;
}

function MediaPlayerFactory(context = {}) {
    return {
        create: function(p2pConfig) {
            return new MediaPlayerWrapper(context, p2pConfig);
        }
    };
}

export default {
    MediaPlayer: MediaPlayerFactory
};

