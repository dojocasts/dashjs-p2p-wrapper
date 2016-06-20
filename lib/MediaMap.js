import SegmentView from './SegmentView';

class MediaMap {
    constructor (manifestHelper) {
        this._manifestHelper = manifestHelper;
    }

    /**
     *
     * @returns boolean
     */
    isLive() {
        return this._manifestHelper.isLive();
    }

    /**
    * @param segmentView {SegmentView}
    * @returns number   (:warning: time must be in second if we want the debug tool (buffer display) to work properly)
    */
    getSegmentTime (segmentView) {
        return segmentView.timeStamp;
    }

    /**
    * @param trackView {TrackView}
    * @param beginTime {number}
    * @param duration {number}
    * @returns [SegmentView]
    */
    getSegmentList (trackView, beginTime, duration) {
        let segmentList = [],
            segmentView;

        let dashjsSegmentList = this._manifestHelper.getSegmentList(trackView, beginTime, duration);
        if (dashjsSegmentList !== undefined) {
            for (var segment of dashjsSegmentList) {
                let startTime = segment.mediaStartTime || segment.startTime;
                if (segment.timescale) {
                    startTime = startTime / segment.timescale;
                }

                if (beginTime <= startTime && startTime <= beginTime + duration) {
                    segmentView = new SegmentView({
                        trackView,
                        timeStamp: startTime
                    });
                    segmentList.push(segmentView);
                }
            }
        }
        return segmentList;
    }

    getNextSegmentView(segmentView) {
        var beginTime = this.getSegmentTime(segmentView) + 0.2;
        // +0.2 will give us a beginTime just after the beginning of the segmentView, so we know it won't be included in the following getSegmentList (condition includes beginTime <= segment.mediaStartTime)

        var segmentList = this.getSegmentList(segmentView.trackView, beginTime, 30);
        return segmentList.length ? segmentList[0] : null;
    }

    getTrackList () {
        let tracks = this._manifestHelper.getAllTracks(),
            trackArray = [];

        // Kind of sucks that we don't expect the same format than in onTrackChange
        for (let type of ["audio", "video"]) {
            if (tracks[type]) {
                trackArray.push(...tracks[type]);
            }
        }

        return trackArray;
    }
}

export default MediaMap;
