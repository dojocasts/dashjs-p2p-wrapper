var SegmentView = require("../lib/SegmentView");
var TrackView = require("../lib/TrackView");

describe("SegmentView", () => {
    describe("toArrayBuffer", () => {

        it("Should be equal to its duplicate if timeStamp < 2^32", () => {
            let segmentView = new SegmentView({timeStamp: 123455, trackView: {periodId: 0, adaptationSetId: 0, representationId: 0} });
            let arrayBuffer = segmentView.toArrayBuffer();
            SegmentView.fromArrayBuffer(arrayBuffer).isEqual(segmentView).should.be.true();
        });

        it("Should be equal to its duplicate if timeStamp >= 2^32", () => {
            let segmentView = new SegmentView({timeStamp: 14609737460, trackView: {periodId: 0, adaptationSetId: 0, representationId: 0} });
            let arrayBuffer = segmentView.toArrayBuffer();
            SegmentView.fromArrayBuffer(arrayBuffer).isEqual(segmentView).should.be.true();
        });
    });

    describe("isEqual", () => {

        it("Should be equal for same timeStamp and TrackView", () => {
            let segmentView1 = new SegmentView({timeStamp: 18609737460.56, trackView: {periodId: 0, adaptationSetId: 0, representationId: 1} });
            let segmentView2 = new SegmentView({timeStamp: 18609737460.56, trackView: {periodId: 0, adaptationSetId: 0, representationId: 1} });
            segmentView1.isEqual(segmentView2).should.be.true();
        });

        it("Should NOT be equal for same timeStamp and DIFFERENT TrackView", () => {
            let segmentView1 = new SegmentView({timeStamp: 3.14159, trackView: {periodId: 1, adaptationSetId: 0, representationId: 1} });
            let segmentView2 = new SegmentView({timeStamp: 3.14159, trackView: {periodId: 0, adaptationSetId: 1, representationId: 0} });
            segmentView1.isEqual(segmentView2).should.be.false();
        });

        it("Should NOT be equal for DIFFERENT timeStamp and same TrackView", () => {
            let segmentView1 = new SegmentView({timeStamp: 0, trackView: {periodId: 0, adaptationSetId: 1, representationId: 1} });
            let segmentView2 = new SegmentView({timeStamp: 18609737460.56, trackView: {periodId: 0, adaptationSetId: 1, representationId: 1} });
            segmentView1.isEqual(segmentView2).should.be.false();
        });

        it("Should NOT be equal for DIFFERENT timeStamp and DIFFERENT TrackView", () => {
            let segmentView1 = new SegmentView({timeStamp: 3.14159, trackView: {periodId: 0, adaptationSetId: 1, representationId: 0} });
            let segmentView2 = new SegmentView({timeStamp: 2.71828, trackView: {periodId: 1, adaptationSetId: 0, representationId: 1} });
            segmentView1.isEqual(segmentView2).should.be.false();
        });
    });

    describe("isInTrack", () => {

        it("Should be in track", () => {
            let trackView = new TrackView({periodId: 0, adaptationSetId: 0, representationId: 0});
            let segmentView = new SegmentView({ timeStamp: 1.61803, trackView: {periodId: 0, adaptationSetId: 0, representationId: 0} });

            segmentView.isInTrack(trackView).should.be.true();
        });

        it("Should NOT be in track if periodId is DIFFERENT", () => {
            let trackView = new TrackView({periodId: 1, adaptationSetId: 0, representationId: 0});
            let segmentView = new SegmentView({ timeStamp: 1.61803, trackView: {periodId: 0, adaptationSetId: 0, representationId: 0} });

            segmentView.isInTrack(trackView).should.be.false();
        });

        it("Should NOT be in track if adaptationSetId is DIFFERENT", () => {
            let trackView = new TrackView({periodId: 0, adaptationSetId: 1, representationId: 0});
            let segmentView = new SegmentView({ timeStamp: 1.61803, trackView: {periodId: 0, adaptationSetId: 0, representationId: 0} });

            segmentView.isInTrack(trackView).should.be.false();
        });

        it("Should NOT be in track if representationId is DIFFERENT", () => {
            let trackView = new TrackView({periodId: 0, adaptationSetId: 0, representationId: 1});
            let segmentView = new SegmentView({ timeStamp: 1.61803, trackView: {periodId: 0, adaptationSetId: 0, representationId: 0} });

            segmentView.isInTrack(trackView).should.be.false();
        });
    });

    describe("toJSON", () => {
        it("The segmentView can be transfered through serialisation", function() {
            var segmentView = new SegmentView({timestamp: 252323423423.3453, trackView: {adaptationId:1, representationId:0}});
            var transferedSegmentView = new SegmentView(JSON.parse(JSON.stringify(segmentView)));
            transferedSegmentView.isEqual(segmentView).should.be.true();
        });
    });
});