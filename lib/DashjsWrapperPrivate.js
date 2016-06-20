import ManifestHelper from './ManifestHelper';
import MediaMap from './MediaMap';
import PlayerInterface from './PlayerInterface';
import SegmentView from './SegmentView';
import FragmentLoaderClassProvider from './FragmentLoaderClassProvider';
import StreamrootPeerAgentModule from 'streamroot-p2p';
import MediaPlayerEvents from '../dashjs/src/streaming/MediaPlayerEvents';

let streamrootPeerAgentModuleClass = StreamrootPeerAgentModule;

class DashjsWrapperPrivate {

    static set StreamrootPeerAgentModule(clazz) {
        streamrootPeerAgentModuleClass = clazz;
    }

    static get StreamrootPeerAgentModule() {
        return streamrootPeerAgentModuleClass;
    }

    constructor (player, videoElement, p2pConfig, liveDelay) {
        this._p2pConfig = p2pConfig;
        this._videoElement = videoElement;
        this._player = player;

        // FIXME: why is this here without a default value? 
        //        shouldn't the customer configure that then?       
        this._liveDelay = liveDelay;
        this._player.setLiveDelay(liveDelay);

        this._player.extend(
            "FragmentLoader", 
            new FragmentLoaderClassProvider(this).SRFragmentLoader, 
            true
        );

        this._player.on(
            MediaPlayerEvents.MANIFEST_LOADED, 
            onManifestLoaded, 
            this
        );
    }

    get peerAgent() {
        return this._peerAgentModule;
    }

    get manifest() {
        return this._manifest;
    }

    get player() {
        return this._player;
    }

    initialize(manifest) {
        this.updateManifest(manifest);

        let manifestHelper = new ManifestHelper(this);

        this._playerInterface = new PlayerInterface(
            this._player, 
            manifestHelper, 
            this._liveDelay
        );

        this._peerAgentModule = new DashjsWrapperPrivate.StreamrootPeerAgentModule(
            this._playerInterface,
            this._manifest.url,
            new MediaMap(manifestHelper),
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

function onManifestLoaded({data}) {
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

export default DashjsWrapperPrivate;
