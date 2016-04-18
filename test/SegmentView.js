var should = require("should");
var SegmentView = require("../lib/SegmentView");
var TrackView = require("../lib/TrackView");

describe ("SegmentView", () => {
    describe("toArrayBuffer", () => {

        it("Should be equal to its duplicate if segmentId < 2^32", () => {
            let segmentView = new SegmentView({segmentId: 123455, trackView: {periodId: 0, adaptationSetId: 0, representationId: 0} });
            let arrayBuffer = segmentView.toArrayBuffer();
            SegmentView.fromArrayBuffer(arrayBuffer).isEqual(segmentView).should.be.true();
        });

        it("Should be equal to its duplicate if segmentId >= 2^32", () => {
            let segmentView = new SegmentView({segmentId: 14609737460, trackView: {periodId: 0, adaptationSetId: 0, representationId: 0} });
            let arrayBuffer = segmentView.toArrayBuffer();
            SegmentView.fromArrayBuffer(arrayBuffer).isEqual(segmentView).should.be.true();
        });
    });
});