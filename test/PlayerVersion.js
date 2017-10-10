import PlayerVersion from '../lib/PlayerVersion';

describe("PlayerVersion",() => {
    it('should output correct major, minor and patch versions', () => {
        const playerVersion = new PlayerVersion('2.6.0');
        playerVersion.major.should.equal(2);
        playerVersion.minor.should.equal(6);
        playerVersion.patch.should.equal(0);
    });
    it('should output correct value for isGTEv2_6', () => {
        let playerVersion;

        playerVersion = new PlayerVersion('2.6.0');
        playerVersion.isGTEv2_6.should.be.true;

        playerVersion = new PlayerVersion('2.5.0');
        playerVersion.isGTEv2_6.should.be.false;

        playerVersion = new PlayerVersion('3.0.0');
        playerVersion.isGTEv2_6.should.be.true;
    });
});
