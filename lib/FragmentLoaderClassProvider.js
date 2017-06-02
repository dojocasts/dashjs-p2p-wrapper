import Events from 'dashjs/build/es5/src/core/events/Events.js';
import MediaPlayerModel from 'dashjs/build/es5/src/streaming/models/MediaPlayerModel.js';
import ErrorHandler from 'dashjs/build/es5/src/streaming/utils/ErrorHandler.js';
import { HTTPRequest } from 'dashjs/build/es5/src/streaming/vo/metrics/HTTPRequest';

import SegmentView from './SegmentView';
import TrackView from './TrackView';
import XHRHeaders from './XHRHeaders';

// This is the dashjs latency threshold to consider requests being cached.
// https://github.com/Dash-Industry-Forum/dash.js/blob/development/src/streaming/rules/abr/ThroughputRule.js#L47
const DASH_INTERNAL_CACHE_LATENCY = 50;

function FragmentLoaderClassProvider(wrapper) {

    const FRAGMENT_LOADER_ERROR_LOADING_FAILURE = 1;
    const FRAGMENT_LOADER_ERROR_NULL_REQUEST = 2;
    const FRAGMENT_LOADER_MESSAGE_NULL_REQUEST = 'request is null';

    const HANDLED_TRACK_TYPES = ['audio', 'video'];

    function compensateTraceTimestamps(traces, requestDurationOffset) {
        let compensatedTraces = Object.assign([], traces);
        compensatedTraces.forEach((trace) => {
            trace.s = new Date(trace.s.getTime() - requestDurationOffset);
        });
        return compensatedTraces;
    }

    function modifyRequestDates(stats, request, traces) {
        const now = Date.now();
        const p2pDownloadDuration = stats.p2pDownloaded ? stats.p2pDuration + stats.cdnDuration : 0;

        request.firstByteDate = request.firstByteDate || request.requestStartDate;
        request.requestEndDate = new Date(now);

        if (p2pDownloadDuration === 0) {
            return;
        }

        // we assume that latency is in stats.latency field, and p2pDownloadDuration is actual downlaod time
        request.firstByteDate = new Date(now - p2pDownloadDuration);

        // if latency is defined, we use its value considering 50ms dash.js cached response treshold
        const latency = stats.latency || DASH_INTERNAL_CACHE_LATENCY;
        request.requestStartDate = new Date(now - p2pDownloadDuration - latency);

        compensateTraceTimestamps(traces, p2pDownloadDuration);
    }

    this.SRFragmentLoader = function (config) {
        const context = this.context;
        const factory = this.factory;
        const parent = this.parent;
        const eventBus = factory.getSingletonInstance(context, "EventBus");

        const log = factory.getSingletonInstance(context, "Debug").log;
        const mediaPlayerModel = MediaPlayerModel(context).getInstance();
        const errHandler = config.errHandler;
        const requestModifier = config.requestModifier;
        const metricsModel = config.metricsModel;

        let instance,
            peerAgent,
            _loader,
            retryTimers,
            downloadErrorToRequestTypeMap,
            remainingAttempts,
            _aborted;

        function setup() {
            peerAgent = wrapper.peerAgentModule;
            retryTimers = [];

            downloadErrorToRequestTypeMap = {
                [HTTPRequest.MPD_TYPE]:                         ErrorHandler.DOWNLOAD_ERROR_ID_MANIFEST,
                [HTTPRequest.XLINK_EXPANSION_TYPE]:             ErrorHandler.DOWNLOAD_ERROR_ID_XLINK,
                [HTTPRequest.INIT_SEGMENT_TYPE]:                ErrorHandler.DOWNLOAD_ERROR_ID_INITIALIZATION,
                [HTTPRequest.MEDIA_SEGMENT_TYPE]:               ErrorHandler.DOWNLOAD_ERROR_ID_CONTENT,
                [HTTPRequest.INDEX_SEGMENT_TYPE]:               ErrorHandler.DOWNLOAD_ERROR_ID_CONTENT,
                [HTTPRequest.BITSTREAM_SWITCHING_SEGMENT_TYPE]: ErrorHandler.DOWNLOAD_ERROR_ID_CONTENT,
                [HTTPRequest.OTHER_TYPE]:                       ErrorHandler.DOWNLOAD_ERROR_ID_CONTENT
            };
        }

        function _getSegmentViewForRequest(request) {
            if (request.type !== "InitializationSegment" &&
                HANDLED_TRACK_TYPES.indexOf(request.mediaInfo.type) >= 0) {
                let trackView = new TrackView({
                    periodId: request.mediaInfo.streamInfo.index,
                    adaptationSetId: request.mediaInfo.index,
                    representationId: request.quality,
                    type: request.mediaInfo.type
                });

                return new SegmentView({
                    trackView,
                    timeStamp: request.startTime
                });
            }

            return null;
        }

        function _getHeadersForRequest(request) {
            let xhrHeaders = requestModifier.modifyRequestHeader(new XHRHeaders());

            let headers = Object.assign({}, xhrHeaders.headers);
            if (request.range) {
                headers.Range = 'bytes=' + request.range;
            }

            return headers;
        }

        function _getSRRequest(request, headers) {

            // From dashjs 2.4 getXHRWithCredentials is replaced with getXHRWithCredentialsForType
            let withCredentials;
            if (typeof mediaPlayerModel.getXHRWithCredentialsForType === 'function') {
                withCredentials = mediaPlayerModel.getXHRWithCredentialsForType(request.type);
            } else {
                withCredentials = mediaPlayerModel.getXHRWithCredentials();
            }

            return {
                url: requestModifier.modifyRequestURL(request.url),
                headers,
                withCredentials: !!withCredentials
            };
        }

        function load(request) {
            remainingAttempts = mediaPlayerModel.getRetryAttemptsForType(request.type);
            _aborted = false;


            if (!request) {
                eventBus.trigger(Events.LOADING_COMPLETED, {
                    request: undefined,
                    error: new Error(
                        FRAGMENT_LOADER_ERROR_NULL_REQUEST,
                        FRAGMENT_LOADER_MESSAGE_NULL_REQUEST
                    )
                });

                return;
            }

            // this need to be set already before calling `metricsModel.addHttpRequest`
            // because the BOLA rule gets evaluated on progress events and needs this info
            request.requestStartDate = new Date();

            const headers = _getHeadersForRequest(request);
            const segmentView = _getSegmentViewForRequest(request);
            const srRequest = _getSRRequest(request, headers);
            const traces = [];

            let lastTraceDate = request.requestStartDate;
            let lastTraceReceivedCount = 0;

            const sendHttpRequestMetric = function(isSuccess, responseCode, contentLength) {
                metricsModel.addHttpRequest(
                    request.mediaType, // mediaType
                    null, // tcpId
                    request.type, // type
                    request.url, // url
                    null, // actualUrl
                    request.serviceLocation || null, // serviceLocation
                    request.range || null, // range
                    request.requestStartDate, // tRequest
                    request.firstByteDate, // tResponse
                    request.requestEndDate, // tFinish
                    responseCode, // responseCode
                    request.duration, // mediaDuration
                    "Content-Length: " + contentLength, // responseHeaders
                    isSuccess ? traces : null // traces
                );
            };

            const onSuccess = function(segmentData, stats) {
                if (_aborted) {
                    return;
                }

                let contentLength = stats.cdnDownloaded + stats.p2pDownloaded;

                modifyRequestDates(stats, request, traces);
                sendHttpRequestMetric(true, 200, contentLength);

                eventBus.trigger(Events.LOADING_COMPLETED, {
                    request: request,
                    response: segmentData,
                    sender: parent
                });
            };

            const onProgress = function(stats) {
                if (_aborted) {
                    return;
                }

                let currentDate = new Date();

                request.firstByteDate = request.firstByteDate || currentDate;

                let bytesLoaded = stats.cdnDownloaded + stats.p2pDownloaded;

                if (stats.lengthComputable) {
                    request.bytesLoaded = bytesLoaded;
                    request.bytesTotal = stats.total;
                }

                traces.push({
                    s: lastTraceDate,
                    d: currentDate.getTime() - lastTraceDate.getTime(),
                    b: [bytesLoaded ? bytesLoaded - lastTraceReceivedCount : 0]
                });

                lastTraceDate = currentDate;
                lastTraceReceivedCount = bytesLoaded;

                eventBus.trigger(Events.LOADING_PROGRESS, {
                    request: request
                });
            };

            const onError = function(httpError) {
                if (_aborted) {
                    return;
                }
                sendHttpRequestMetric(false, httpError.status);

                if (remainingAttempts > 0) {
                    log('Failed loading fragment: ' + request.mediaType + ':' + request.type + ':' + request.startTime + ', retry in ' + mediaPlayerModel.getRetryIntervalForType(request.type) + 'ms' + ' attempts: ' + remainingAttempts);

                    remainingAttempts--;
                    retryTimers.push(
                        setTimeout(function () {
                            load(request, remainingAttempts);
                        }, mediaPlayerModel.getRetryIntervalForType(request.type))
                    );
                } else {
                    log('Failed loading fragment: ' + request.mediaType + ':' + request.type + ':' + request.startTime + ' no retry attempts left');

                    errHandler.downloadError(
                        downloadErrorToRequestTypeMap[request.type],
                        request.url,
                        request
                    );

                    eventBus.trigger(Events.LOADING_COMPLETED, {
                        request: undefined,
                        error: new Error(
                            FRAGMENT_LOADER_ERROR_LOADING_FAILURE,
                            "failed loading fragment"
                        )
                    });
                }
            };

            _loader = peerAgent.getSegment(
                srRequest,
                {
                    onSuccess,
                    onProgress,
                    onError
                },
                segmentView
            );
        }

        function abort() {
            _aborted = true;

            remainingAttempts = 0; // Prevent any retry
            retryTimers.forEach(t => clearTimeout(t));
            retryTimers = [];

            if (_loader) {
                _loader.abort();
            }
            _loader = null;
        }

        // FIXME: why do we need two functions that do the exact same thing?
        function reset() {
            abort();
        }

        instance = {
            load,
            abort,
            reset
        };

        setup();

        return instance;
    };
}

export default FragmentLoaderClassProvider;
