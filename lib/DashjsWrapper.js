import ManifestHelper from './ManifestHelper';
import MediaMap from './MediaMap';
import PlayerInterface from './PlayerInterface';
import SegmentView from './SegmentView';
import SRFragmentLoaderClassProvider from './SRFragmentLoaderClassProvider';
import DashjsInternals from './DashjsInternals';
import StreamrootPeerAgentModule from 'streamroot-p2p';

require('../dashjs/all');

const INTEGRATION_VERSION = 'v1';

class DashjsWrapper {

    constructor (player, p2pConfig, liveDelay) {
        this._player = player;
        this._p2pConfig = p2pConfig;

        this._liveDelay = liveDelay;
        this._player.setLiveDelay(liveDelay);

        this._dashjsInternals = new DashjsInternals(player);

        const fragmentLoaderClass = new SRFragmentLoaderClassProvider(this).SRFragmentLoader;
        this._player.extend("FragmentLoader", fragmentLoaderClass, true);

        this._player.on(window.dashjs.MediaPlayer.events.MANIFEST_LOADED, this._onManifestLoaded, this);
    }

    get srDownloader() {
        return this._srDownloader;
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
        this._playerInterface = new PlayerInterface(this._player, manifestHelper, this._liveDelay);
        let mediaMap = new MediaMap(manifestHelper);

        this._srDownloader = new StreamrootPeerAgentModule(
            this._playerInterface,
            this._manifest.url,
            mediaMap,
            this._p2pConfig,
            SegmentView,
            StreamrootPeerAgentModule.StreamTypes.DASH,
            INTEGRATION_VERSION
        );
    }

    dispose() {
        if (this._srDownloader) {
            this._srDownloader.dispose();
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
