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

    describe("isEqual", () => {

        it ("Should be equal for same segmentId and TrackView", () => {
            let segmentView1 = new SegmentView({segmentId: 18609737460.56, trackView: {periodId: 0, adaptationSetId: 0, representationId: 1} });
            let segmentView2 = new SegmentView({segmentId: 18609737460.56, trackView: {periodId: 0, adaptationSetId: 0, representationId: 1} });
            segmentView1.isEqual(segmentView2).should.be.true();
        });

        it ("Should NOT be equal for same segmentId and DIFFERENT TrackView", () => {
            let segmentView1 = new SegmentView({segmentId: 3.14159, trackView: {periodId: 1, adaptationSetId: 0, representationId: 1} });
            let segmentView2 = new SegmentView({segmentId: 3.14159, trackView: {periodId: 0, adaptationSetId: 1, representationId: 0} });
            segmentView1.isEqual(segmentView2).should.be.false();
        });

        it ("Should NOT be equal for DIFFERENT segmentId and same TrackView", () => {
            let segmentView1 = new SegmentView({segmentId: 0, trackView: {periodId: 0, adaptationSetId: 1, representationId: 1} });
            let segmentView2 = new SegmentView({segmentId: 18609737460.56, trackView: {periodId: 0, adaptationSetId: 1, representationId: 1} });
            segmentView1.isEqual(segmentView2).should.be.false();
        });

        it ("Should NOT be equal for DIFFERENT segmentId and DIFFERENT TrackView", () => {
            let segmentView1 = new SegmentView({segmentId: 3.14159, trackView: {periodId: 0, adaptationSetId: 1, representationId: 0} });
            let segmentView2 = new SegmentView({segmentId: 2.71828, trackView: {periodId: 1, adaptationSetId: 0, representationId: 1} });
            segmentView1.isEqual(segmentView2).should.be.false();
        });
    });
});