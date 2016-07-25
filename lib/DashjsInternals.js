/**
* DashjsInternals class
* This class must be instatiatied only once per each instance of dash.js MediaPlayer.
* It exposes dash.js private methods for getting access to TimeLineConverter,
* ManifestModel, Config and Context instances.
*/

class DashjsInternals {

    /**
    * @player -- instance of dash.js MediaPlayer
    */
    constructor(player) {

        let getConfig,
            getContext,
            getDashManifestModel,
            getTimelineConverter;

        function StreamSR (config) {

            let factory = this.factory,
                context = this.context;

            getConfig = function() {
                return config;
            };

            getContext = function() {
                return context;
            };

            getDashManifestModel = function () {
                return factory.getSingletonInstance(context, "DashManifestModel");
            };

            getTimelineConverter = function () {
                return config.timelineConverter;
            };
        }

        this.getDashManifestModel = function () {
            return getDashManifestModel ? getDashManifestModel() : undefined;
        };

        this.getTimelineConverter = function () {
            return getTimelineConverter ? getTimelineConverter() : undefined;
        };

        this.getConfig = function() {
            return getConfig();
        };

        this.getContext = function() {
            return getContext();
        };

        player.extend("Stream", StreamSR, true);
    }
}

export default DashjsInternals;