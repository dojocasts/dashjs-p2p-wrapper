import DashjsWrapperPrivate from './DashjsWrapperPrivate';

class DashjsWrapper {

    constructor(player, videoElement, p2pConfig, liveDelay) {
        let wrapper = new DashjsWrapperPrivate(player, videoElement, p2pConfig, liveDelay);
        // FIXME: do we even need these kind off functions as public API?
        /*
        this.initialize = wrapper.initialize.bind(wrapper);
        this.dispose = wrapper.dispose.bind(wrapper);
        this.updateManifest = wrapper.updateManifest.bind(wrapper);
        */
    }
}

export default DashjsWrapper;
