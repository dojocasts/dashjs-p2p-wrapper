import ManifestHelper from './ManifestHelper';
import MediaMap from './MediaMap';
import PlayerInterface from './PlayerInterface';
import SegmentView from './SegmentView';
import FragmentLoaderClassProvider from './FragmentLoaderClassProvider';
import DashjsInternals from './DashjsInternals';
import StreamrootPeerAgentModule from 'streamroot-p2p';

require('../dashjs/all');

class DashjsWrapper {

    constructor (player, videoElement, p2pConfig, liveDelay) {
        this._player = player;
        this._videoElement = videoElement;
        this._p2pConfig = p2pConfig;

        this._liveDelay = liveDelay;
        this._player.setLiveDelay(liveDelay);

        this._dashjsInternals = new DashjsInternals(player);

        this._player.extend(
            "FragmentLoader", 
            new FragmentLoaderClassProvider(this).SRFragmentLoader, 
            true
        );

        this._player.on(
            window.dashjs.MediaPlayer.events.MANIFEST_LOADED, 
            this._onManifestLoaded, 
            this
        );
    }

    get peerAgent() {
        return this._peerAgentModule;
    }

    get manifest() {
        return this._manifest;
    }

    _onManifestLoaded ({ data }) {
        if (!data) {
            this.dispose();
            return;
        }

        if (!this._manifest) {
            this.initialize(data);
            return;
        }

        if (data.url !== this._manifest.url) {
            this.dispose();
            this.initialize(data);
        } else {
            this.updateManifest(data);
        }
    }

    initialize(manifest) {
        this.updateManifest(manifest);

        let manifestHelper = new ManifestHelper(this._player, this, this._dashjsInternals);
        let mediaMap = new MediaMap(manifestHelper);

        this._playerInterface = new PlayerInterface(this._player, manifestHelper, this._liveDelay);
        this._peerAgentModule = new StreamrootPeerAgentModule(
            this._playerInterface,
            this._manifest.url,
            mediaMap,
            this._p2pConfig,
            SegmentView,
            this._videoElement
        );
    }

    dispose() {
        if (this._peerAgentModule) {
            this._peerAgentModule.dispose();
        }

        if (this._playerInterface) {
            this._playerInterface.dispose();
        }

        this._manifest = null;
    }

    updateManifest(manifest) {
        this._manifest = manifest;
    }
}

export default DashjsWrapper;
