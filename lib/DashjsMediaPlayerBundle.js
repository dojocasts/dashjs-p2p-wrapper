require('../node_modules/dashjs/dist/dash.all.debug');

import DashjsWrapper from './DashjsWrapper';

function MediaPlayer(p2pConfig) {
  const liveDelay = 30;
  let player = window.dashjs.MediaPlayer().create();

  new DashjsWrapper(player, p2pConfig.videoElement, p2pConfig, liveDelay);

  // Note: We will evaluate to player instance even when used as a constructor
  return player;
}

function MediaPlayerFactory() {
  return {
    create: function(p2pConfig) {
      return new MediaPlayer(p2pConfig);
    }
  }
}

export default {
  MediaPlayer: MediaPlayerFactory
};

