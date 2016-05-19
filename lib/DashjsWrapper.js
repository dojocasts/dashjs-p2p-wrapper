import ManifestHelper from './ManifestHelper';
import MediaMap from './MediaMap';
import PlayerInterface from './PlayerInterface';
import SegmentView from './SegmentView';
import SRFragmentLoaderClassProvider from './SRFragmentLoaderClassProvider';
import DashjsInternals from './DashjsInternals';

class DashjsWrapper {

    constructor (player, videoElement, p2pConfig, liveDelay, bufferLevel) {
        this._player = player;
        this._videoElement = videoElement;
        this._p2pConfig = p2pConfig;

        this._liveDelay = liveDelay;
        this._bufferLevel = bufferLevel;
        this._player.setLiveDelay(liveDelay);

        this._dashjsInternals = new DashjsInternals(player);

        const fragmentLoaderClass = new SRFragmentLoaderClassProvider(this).SRFragmentLoader;
        this._player.extend("FragmentLoader", fragmentLoaderClass, true);

        this._player.on(dashjs.MediaPlayer.events.MANIFEST_LOADED, this._onManifestLoaded, this);
    }

    get srDownloader() {
        return this._srDownloader;
    }

    _onManifestLoaded ({ data }) {
console.info("_onManifestLoaded(): manifest=", data);

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

    get manifest() {
        return this._manifest;
    }

    initialize(manifest) {
console.info("initialize()");
        this.updateManifest(manifest);

        let manifestHelper = new ManifestHelper(this._player, this, this._dashjsInternals);
        this._playerInterface = new PlayerInterface(this._player, manifestHelper, this._liveDelay, this._bufferLevel);
        let mediaMap = new MediaMap(manifestHelper);

        this._srDownloader = new window.Streamroot.Downloader(
            this._playerInterface,
            this._manifest.url,
            mediaMap,
            this._p2pConfig,
            SegmentView,
            this._videoElement
        );
    }

    dispose() {
console.info("dispose()");
        if (this._srDownloader) {
            // try {this._srDownloader.dispose();} catch(error) {}
            this._srDownloader.dispose();
        }

        if (this._playerInterface) {
            this._playerInterface.dispose();
        }

        this._manifest = null;
    }

    updateManifest(manifest){
console.info("updateManifest(): manifest=", manifest);
        this._manifest = manifest;
    }
}

export default DashjsWrapper;
