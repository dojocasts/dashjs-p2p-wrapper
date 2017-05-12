var updateIntervalId;
var player;

var p2pConfig = {
    streamrootKey: 'dev-opensource',
};

function getURLParams(url) {
    if (!url) {
        return {};
    }

    var search = url.substring(1); //removing '?'
    var paramValueList = search.split("&");
    var params = {};
    paramValueList.forEach(function(entry){
        var paramValue = entry.split("=");
        if (entry) {
            params[paramValue[0]] = decodeURIComponent(paramValue[1]);
        }
    });

    return params;
}

function parseURLOption(params, option, defaultValue) {
    return !!(params[option] !== undefined ? parseInt(params[option]) : defaultValue);
}

(function() {

    // manifest selector handler
    document.getElementById("mpdSelector").onchange = function() {
        var mpdUrl = document.getElementById("mpdSelector").value;
        player.attachSource(mpdUrl);
    };

    var videoElement = document.getElementById("videoPlayer");
    videoElement.addEventListener('error', function(ev) {
        console.log(ev);
        console.log(videoElement.error);
    });

    var urlParams = getURLParams(document.location.search);
    var url = urlParams.mpd || mpdSelector.value;

    player = createPlayer(videoElement, url, urlParams, p2pConfig);

    mpdSelector.value = url;

})();
