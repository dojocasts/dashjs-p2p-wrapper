import SwitchRequest from 'dashjs/build/es5/src/streaming/rules/SwitchRequest';

function ThroughputRuleClassProvider(wrapper) {

    // SwitchRequest's interface has been modified in dash.js's development branch (at this date the latest release is 2.5.0).
    // Fortunately, the development branch also introduces dashjs.FactoryMaker, which allows us to get the correct ClassFactory for SwitchRequest.
    // The next blocks allows us to stay compatible with future versions, while ensuring compatibility with v2.5.0 and lower
    const factory = dashjs.FactoryMaker;
    let SwitchRequestClassFactory;
    if (factory) {
        SwitchRequestClassFactory = factory.getClassFactoryByName('SwitchRequest');
    } else {
        SwitchRequestClassFactory = SwitchRequest;
    }

    this.SRThroughputRule = function () {
        const parentGetMaxIndex = this.parent.getMaxIndex;
        const context = this.context;

        function getMaxIndex (rulesContext) {
            let switchRequest = parentGetMaxIndex(rulesContext);
            const currentQuality = rulesContext.getCurrentValue();
            const type = rulesContext.getMediaInfo().type;

            if (type !== 'video' && type !== 'audio') {
                return switchRequest;
            }

            if (switchRequest.value < currentQuality && wrapper.peerAgentModule.nextSegmentPrebuffered && wrapper.peerAgentModule.nextSegmentPrebuffered[type]) {
                // If the default throughput rule was going to trigger a downswitch, but we already prebuffered the next fragment, prevent downswitch.
                switchRequest.value = currentQuality;
                switchRequest = SwitchRequestClassFactory(context).create(); // eslint-disable-line new-cap
            };

            return switchRequest;
        }

        let instance = {
            getMaxIndex,
        };

        return instance;
    };
};

export default ThroughputRuleClassProvider;
