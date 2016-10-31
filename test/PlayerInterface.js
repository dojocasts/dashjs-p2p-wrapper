import PlayerInterface from '../lib/PlayerInterface';
import 'dashjs';

describe("PlayerInterface",() => {
    describe("getBufferLevelMax", function() {
        it('should be calculated correctly', () => {
            let player = {
                on: () => {},
            };
            let manifestHelper = {};
            let liveDelay = 30;
            let playerInterface = new PlayerInterface(player, manifestHelper, liveDelay);
            playerInterface.getBufferLevelMax().should.be.equal(20); // liveDelay - MIN_BUFFER_LEVEL(10 seconds)
        });
    });
});