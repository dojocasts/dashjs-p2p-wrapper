import DashjsWrapperPrivate from './DashjsWrapperPrivate';

class DashjsWrapper {

    constructor(player, p2pConfig, liveDelay) {
        let wrapper = new DashjsWrapperPrivate(player, p2pConfig, liveDelay);

        Object.defineProperty(this, "stats", {
            get() {
                console.info(wrapper.peerAgentModule);
                return wrapper.peerAgentModule.stats;
            }
        });
    }

    static get version() {
        return DashjsWrapperPrivate.version;
    }
}

export default DashjsWrapper;
