import EventEmitter from 'eventemitter3';
import TrackView from './TrackView';
import ExternalEvents from './ExternalEvents';

// Doing it like this to handle event name difference between dash.js v2.2, v2.3, v2.4
const QUALITY_CHANGE_EVENT = dashjs.MediaPlayer.events.QUALITY_CHANGE_START
                                || dashjs.MediaPlayer.events.QUALITY_CHANGE_REQUESTED;

const STREAM_INITIALIZED_EVENT = dashjs.MediaPlayer.events.STREAM_INITIALIZED;
const FRAGMENT_LOADING_ABANDONED_EVENT = dashjs.MediaPlayer.events.FRAGMENT_LOADING_ABANDONED
                                            || 'fragmentLoadingAbandoned'; // event is not exposed in v2.3

class PlayerInterface extends EventEmitter {

    constructor (player, manifestHelper, liveDelay) {
        super();

        this._player = player;
        this._manifestHelper = manifestHelper;
        this._liveDelay = liveDelay;

        this._bufferLevelMax = Math.max(0, this._liveDelay);

        if (QUALITY_CHANGE_EVENT === undefined) {
            throw new Error('Can\'t find neither QUALITY_CHANGE_START nor QUALITY_CHANGE_REQUESTED dash.js event.');
        }

        if (STREAM_INITIALIZED_EVENT === undefined) {
            throw new Error('Can\'t find STREAM_INITIALIZED dash.js event.');
        }

        if (FRAGMENT_LOADING_ABANDONED_EVENT === undefined) {
            throw new Error('Can\'t find FRAGMENT_LOADING_ABANDONED dash.js event.');
        }

        // STREAM_INITIALIZED_EVENT should be handled only once to send initial tracks to peer-agent.
        // This event is triggered each time manifest is reloaded.
        // So handling it everytime breaks track switch metrics.
        this._player.on(STREAM_INITIALIZED_EVENT, this._onStreamInitialized, this);
        this._player.on(FRAGMENT_LOADING_ABANDONED_EVENT, this._onFragLoadingAbandoned, this);
    }

    dispose() {
        this._player.off(FRAGMENT_LOADING_ABANDONED_EVENT, this._onFragLoadingAbandoned, this);
        this._player.off(QUALITY_CHANGE_EVENT, this._onQualityChanged, this);
        this._player.off(STREAM_INITIALIZED_EVENT, this._onStreamInitialized, this);

        this.removeAllListeners();
    }

    isLive () {
        return this._manifestHelper.isLive();
    }

    getBufferLevelMax () {
        return this._bufferLevelMax;
    }

    setBufferMarginLive(bufferLevel) {
        let safeBufferLevel = bufferLevel;
        if (safeBufferLevel > this._bufferLevelMax) {
            safeBufferLevel = this._bufferLevelMax;
            console.info("setBufferMarginLive(): buffer level from tracker was capped to=", safeBufferLevel);
        }

        this._dashjsBufferTime = safeBufferLevel;

        /*
         * Here we are setting an artificial constrain to the
         * streaming buffer that might be lower than usual.
         * This necessary to allow the avalanche effect across peers
         * so that not everything is downloaded from P2P right away,
         * but instead give some time to the peer-agent to aggregate some
         * future segments before they get requested by the media-engine.
         *
         * When using BOLA ABR rule, we rely on buffer fillness to
         * determine an appropriate bandwidth matching bandwidth available.
         * Since we set this limitation one could argue that it limits
         * the matched quality level. Also, the current BOLA theory model
         * does not accomodate for an articially set limit in download scheduling
         * i.e buffer size targets.
         *
         * But the actual implementation as of Dash.js 2.3.0 in BolaRule.js
         * accomodates for these cases:
         *
         * `virtualBuffer` field in BolaState struct is being incremented
         * with respect to scheduler idle time in order to emulate possibly
         * downloaed segments at a bitrate at max lower than available bandwidth.
         * This `virtualBuffer` is reset when the buffer is stalled (empty) or
         * when the buffer fill reaches a critically low level (currently 100ms).
         *
         * Stability of our technology in combination with BOLA ABR might
         * be related to fine-tuning of the above parameter
         * (when to reset `virtualBuffer` in BolaState). If we don't reset it
         * soon enough we might download a too high quality as our matching
         * is biased by a too high virtual-buffer, while the real buffer level is very low already.
         * On the other side of the trade-off stands: If we reset the virtual buffer too defensively,
         * we might choose a sub-optimal quality.
         *
         * NOTE: Current BOLA implementation uses buffer-level in its steady state
         *       but will use a previous request stats to determine an appropriate startup bitrate.
         *       Therefore a correct stats feedback from loaders also matter in this case.
         *
         * See: http://arxiv.org/abs/1601.06748
         *
         */
        this._player.setStableBufferTime(this._dashjsBufferTime);
        this._player.setBufferTimeAtTopQuality(this._dashjsBufferTime);
        this._player.setBufferTimeAtTopQualityLongForm(this._dashjsBufferTime); // TODO: can live be "long form" ?
    }

    addEventListener (eventName, listener) {
        if (ExternalEvents.isSupported(eventName)) {
            this.on(eventName, listener);
        } else {
            console.warn('Trying to add an unsupported event listener. eventName=', eventName);
        }
    }

    removeEventListener(eventName, listener) {
        if (ExternalEvents.isSupported(eventName)) {
            this.removeListener(eventName, listener);
        } else {
            console.warn('Trying to remove an unsupported event listener. eventName=', eventName);
        }
    }

    _onStreamInitialized() {
        // As we handle this event once per manifest, we unsubscribe from it
        // Should be done in this async way, otherwise dash.js hit some hidden error, a
        // And dynamic stream switching becomes broken.
        setTimeout(this._player.off, 0, STREAM_INITIALIZED_EVENT, this._onStreamInitialized, this);

        // And subscribe to quality switch event instead
        this._player.on(QUALITY_CHANGE_EVENT, this._onQualityChanged, this);

        // Sending initial tracks to peer agent
        this.emit(ExternalEvents.TRACK_CHANGE_EVENT, this._manifestHelper.getCurrentTracks());
    }

    _onQualityChanged({ mediaType, streamInfo, newQuality }) {
        const tracks = {};
        const adaptation = this._player.getCurrentTrackFor(mediaType);
        tracks[mediaType] = new TrackView({
            periodId: streamInfo.index,
            adaptationSetId: adaptation.index,
            representationId: Number(newQuality),
            mediaType,
            bitrate: adaptation.bitrateList[newQuality].bandwidth,
        });

        this.emit(ExternalEvents.TRACK_CHANGE_EVENT, tracks);
    }

    _onFragLoadingAbandoned() {
        this.emit(ExternalEvents.EMERGENCY_FRAG_LOAD_ABORT);
    }

}

export default PlayerInterface;
