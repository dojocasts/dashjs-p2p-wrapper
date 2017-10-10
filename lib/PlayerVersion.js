class PlayerVersion {

    constructor(versionString) {

        const splitVersion = versionString.split('.');

        this._major = Number(splitVersion[0]);
        this._minor = Number(splitVersion[1]);
        this._patch = Number(splitVersion[2]);
    }

    get major() {
        return this._major;
    }

    get minor() {
        return this._minor;
    }

    get patch() {
        return this._patch;
    }

    get isGTEv2_6() {
        return this.major > 2 || (this.major === 2 && this.minor >= 6);
    }
}

export default PlayerVersion;
