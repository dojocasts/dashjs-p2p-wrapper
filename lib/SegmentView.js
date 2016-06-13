import TrackView from './TrackView';

class SegmentView {

    /**
    * @param arrayBuffer {ArrayBuffer}
    * @returns {SegmentView}
    */
    static fromArrayBuffer(arrayBuffer) {
        let u8data = new Uint8Array(arrayBuffer);

        let u32buffer = u8data.slice(0, 12).buffer;
        let u32data = new Uint32Array(u32buffer);
        let [periodId, adaptationSetId, representationId] = u32data;

        let f64buffer = u8data.slice(12).buffer;
        let f64data = new Float64Array(f64buffer);
        let timeStamp = f64data[0];

        let trackView = {periodId, adaptationSetId, representationId};

        return new SegmentView({timeStamp, trackView});
    }

    /**
      * @param {Object} object
      */
    constructor(obj) {
        this.timeStamp = obj.timeStamp;
        this.trackView = new TrackView(obj.trackView);
    }

    /**
      * Determines if a segment represent the same media chunk than another segment
      * @param segmentView {SegmentView}
      * @returns {boolean}
      */
    isEqual(segmentView) {
        if (!segmentView) {
            return false;
        }
        let {timeStamp, trackView} = segmentView;
        return this.timeStamp === timeStamp && this.trackView.isEqual(trackView);
    }

    /**
      * @param trackView {TrackView}
      * @returns {boolean}
      */
    isInTrack(trackView) {
        return this.trackView.isEqual(trackView);
    }

    /**
      * @returns {String}
      */
    viewToString() {
        return `${this.trackView.viewToString()}S${this.timeStamp}`;
    }

    /**
      * @returns {ArrayBuffer}
      */
    toArrayBuffer() {
        let u32data = new Uint32Array([this.trackView.periodId, this.trackView.adaptationSetId, this.trackView.representationId]);
        let f64data = new Float64Array([this.timeStamp]);

        let array = new Uint8Array(u32data.byteLength + f64data.byteLength);
        array.set(new Uint8Array(u32data.buffer), 0);
        array.set(new Uint8Array(f64data.buffer), 12);

        return array.buffer;
    }
}

export default SegmentView;
