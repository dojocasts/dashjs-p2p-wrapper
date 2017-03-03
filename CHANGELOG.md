# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).
This changelog's template come from [keepachangelog.com](http://keepachangelog.com/). When editing this document, please follow the convention specified there.

## [Dev]

## [Unreleased]

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
[1.10.3]: https://github.com/streamroot/dashjs-p2p-wrapper/compare/v1.10.2...v1.10.3[1.10.4]: https://github.com/streamroot/dashjs-p2p-wrapper/compare/v1.10.2...v1.10.4[1.10.5]: https://github.com/streamroot/dashjs-p2p-wrapper/compare/v1.10.2...v1.10.5