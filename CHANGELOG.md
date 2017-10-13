# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).
This changelog's template come from [keepachangelog.com](http://keepachangelog.com/). When editing this document, please follow the convention specified there.

## [Dev]

## [Unreleased]
### Fixed
- Downswitch prevention when next segment is already prebuffered was broken for dash.js 2.6.0

## [1.11.43] - 2017-10-10
### Fixed
- Compatibility with dash.js v2.6.0

## [1.11.38] - 2017-08-21
### Fixed
- Integration bug with number based SegmentTemplate manifests (`getSegmentList` used to always return the first N segments from the playlist)

## [1.11.36] - 2017-08-11
### Fixed
- Downswitch prevention when next segment is already prebuffered was not working as expected

## [1.11.26] - 2017-06-27
### Added
- Added bitrate property on TrackView
- Prevent downswitch if the next segment is already prebuffered in the peer-agent

## [1.11.18] - 2017-06-14
### Changed
- Change ABR feedback: latency included in p2pDownloadDuration
- Use dash.js fork with SegmentTimeline patch

## [1.11.17] - 2017-06-14
### Fixed
- Detect when player is reset and dispose the wrapper.

## [1.11.15] - 2017-06-02
### Fixed
- Make sure we don't call any FragmentLoader callback once a request is aborted (we used to call the downloadError callback)

## [1.11.14] - 2017-05-31
### Fixed
- HttpRequestMetric format in our fragment loader: was expecting string for response headers. Returning null could break some 3rd party plugins

## [1.11.13] - 2017-05-31
### Fixed
- Prevent fragment load retry after abort (could cause a fragment of a previous bitrate to be appended after bitrate switch, causing decode error)

## [1.11.10] - 2017-05-12
### Fixed
- Adjust download latency for hybrid and full P2P segments to always be considered as "non-cached" segments.

## [1.11.0] - 2017-03-13
### Added
- Catching fragment loading abortion(due to unsufficient bandwidth) and notifying peer agent about that.
- `type` property to TrackView.

### Changed
- Simplified peer agent event handling.

### Fixed
- Catching quality switch events.
- Multiple current tracks update on STREAM_INITIALIZED event for live streams. (Breaks track switch count metrics).
- Peer agent event handlers disposal.

## [1.10.2] - 2017-02-13

### Fixed
- Fix playback hanging on Firefox.

## [1.10.0] - 2017-02-08

### Added
- Ruby script to generate example wrapper page with a specific version of Dash.js.

### Changed
- Replace debug tools in example page with `public-graph`.

### Fixed
- Fix breaking changes from Dash.js 2.4.

## [1.9.4] - 2017-01-30
### Changed
- Pass total in onProgress stats when available

## [1.9.2] - 2017-01-20
### Fixed
- Wrapper exception when accessing undefined peerAgentModule.

## [1.9.0] - 2017-01-10
### Changed
- Makefile and Ruby build scripts were replaced by Webpack.

## [1.8.0] - 2016-11-16
### Removed
- Remove MIN_BUFFER_LEVEL from the wrapper. It is now handled by the peer-agent

## [1.7.3] - 2016-11-10
- Expect HttpError instance passed in fragment loader's onError callback

## [1.7.2] - 2016-11-03
### Added
- Filter supported media types to handle only `audio` and `video`

## [1.7.0] - 2016-10-31
### Fixed
- maxBufferLevel being NaN

## [1.6.0] - 2016-10-06
### Added
- `RequestModifier.modifyRequestHeader` support
- `withCredentials` param support
- Expose version on private and public API
- Expose peer-agent stats

### Changed
- Use getLiveDelay from dash.js MediaPlayer API if existent

## [1.5.1] - 2016-08-18
### Fixed
- HTTPRequest import
- dist_wrapper.rb script

## [1.5.0] - 2016-08-18
### Updated
- dashjs version to 2.2.0

### Fixed
- scripts on Windows

## [1.4.2] - 2016-07-26
### Changed
- Pass media element to peer agent

## [1.4.0] - 2016-07-25
### Fixed
- Exception on `mediaPlayer.attachSource()` (playlist support).

## [1.3.0] - 2016-07-11
### Changed
- Publish npm dist as rc when comming from master
[1.10.3]: https://github.com/streamroot/dashjs-p2p-wrapper/compare/v1.10.2...v1.10.3[1.10.4]: https://github.com/streamroot/dashjs-p2p-wrapper/compare/v1.10.2...v1.10.4[1.10.5]: https://github.com/streamroot/dashjs-p2p-wrapper/compare/v1.10.2...v1.10.5[1.11.0]: https://github.com/streamroot/dashjs-p2p-wrapper/compare/v1.10.2...v1.11.0[1.11.1]: https://github.com/streamroot/dashjs-p2p-wrapper/compare/v1.11.0...v1.11.1[1.11.2]: https://github.com/streamroot/dashjs-p2p-wrapper/compare/v1.11.0...v1.11.2[1.11.3]: https://github.com/streamroot/dashjs-p2p-wrapper/compare/v1.11.0...v1.11.3
[1.11.4]: https://github.com/streamroot/dashjs-p2p-wrapper/compare/v1.11.0...v1.11.4
[1.11.5]: https://github.com/streamroot/dashjs-p2p-wrapper/compare/v1.11.0...v1.11.5
[1.11.6]: https://github.com/streamroot/dashjs-p2p-wrapper/compare/v1.11.0...v1.11.6
[1.11.7]: https://github.com/streamroot/dashjs-p2p-wrapper/compare/v1.11.0...v1.11.7
[1.11.8]: https://github.com/streamroot/dashjs-p2p-wrapper/compare/v1.11.0...v1.11.8
[1.11.9]: https://github.com/streamroot/dashjs-p2p-wrapper/compare/v1.11.0...v1.11.9
[1.11.10]: https://github.com/streamroot/dashjs-p2p-wrapper/compare/v1.11.0...v1.11.10
[1.11.11]: https://github.com/streamroot/dashjs-p2p-wrapper/compare/v1.11.10...v1.11.11
[1.11.12]: https://github.com/streamroot/dashjs-p2p-wrapper/compare/v1.11.10...v1.11.12
[1.11.13]: https://github.com/streamroot/dashjs-p2p-wrapper/compare/v1.11.10...v1.11.13
[1.11.14]: https://github.com/streamroot/dashjs-p2p-wrapper/compare/v1.11.13...v1.11.14
[1.11.15]: https://github.com/streamroot/dashjs-p2p-wrapper/compare/v1.11.14...v1.11.15
[1.11.16]: https://github.com/streamroot/dashjs-p2p-wrapper/compare/v1.11.15...v1.11.16
[1.11.17]: https://github.com/streamroot/dashjs-p2p-wrapper/compare/v1.11.15...v1.11.17
[1.11.18]: https://github.com/streamroot/dashjs-p2p-wrapper/compare/v1.11.17...v1.11.18
[1.11.19]: https://github.com/streamroot/dashjs-p2p-wrapper/compare/v1.11.18...v1.11.19
[1.11.20]: https://github.com/streamroot/dashjs-p2p-wrapper/compare/v1.11.18...v1.11.20
[1.11.21]: https://github.com/streamroot/dashjs-p2p-wrapper/compare/v1.11.18...v1.11.21
[1.11.22]: https://github.com/streamroot/dashjs-p2p-wrapper/compare/v1.11.18...v1.11.22
[1.11.23]: https://github.com/streamroot/dashjs-p2p-wrapper/compare/v1.11.18...v1.11.23
[1.11.24]: https://github.com/streamroot/dashjs-p2p-wrapper/compare/v1.11.18...v1.11.24
[1.11.25]: https://github.com/streamroot/dashjs-p2p-wrapper/compare/v1.11.18...v1.11.25
[1.11.26]: https://github.com/streamroot/dashjs-p2p-wrapper/compare/v1.11.18...v1.11.26
[1.11.27]: https://github.com/streamroot/dashjs-p2p-wrapper/compare/v1.11.26...v1.11.27
[1.11.28]: https://github.com/streamroot/dashjs-p2p-wrapper/compare/v1.11.26...v1.11.28
[1.11.29]: https://github.com/streamroot/dashjs-p2p-wrapper/compare/v1.11.26...v1.11.29
[1.11.30]: https://github.com/streamroot/dashjs-p2p-wrapper/compare/v1.11.26...v1.11.30
[1.11.31]: https://github.com/streamroot/dashjs-p2p-wrapper/compare/v1.11.26...v1.11.31
[1.11.32]: https://github.com/streamroot/dashjs-p2p-wrapper/compare/v1.11.26...v1.11.32
[1.11.33]: https://github.com/streamroot/dashjs-p2p-wrapper/compare/v1.11.26...v1.11.33
[1.11.34]: https://github.com/streamroot/dashjs-p2p-wrapper/compare/v1.11.26...v1.11.34
[1.11.35]: https://github.com/streamroot/dashjs-p2p-wrapper/compare/v1.11.26...v1.11.35
[1.11.36]: https://github.com/streamroot/dashjs-p2p-wrapper/compare/v1.11.26...v1.11.36
[1.11.37]: https://github.com/streamroot/dashjs-p2p-wrapper/compare/v1.11.36...v1.11.37
[1.11.38]: https://github.com/streamroot/dashjs-p2p-wrapper/compare/v1.11.36...v1.11.38
[1.11.39]: https://github.com/streamroot/dashjs-p2p-wrapper/compare/v1.11.38...v1.11.39
[1.11.40]: https://github.com/streamroot/dashjs-p2p-wrapper/compare/v1.11.38...v1.11.40
[1.11.41]: https://github.com/streamroot/dashjs-p2p-wrapper/compare/v1.11.38...v1.11.41
[1.11.42]: https://github.com/streamroot/dashjs-p2p-wrapper/compare/v1.11.38...v1.11.42
[1.11.43]: https://github.com/streamroot/dashjs-p2p-wrapper/compare/v1.11.38...v1.11.43
