# dashjs-p2p-wrapper

Dash.js P2P wrapper. It enables [Streamroot's P2P](http://streamroot.io) solution for [dash.js](https://github.com/Dash-Industry-Forum/dash.js).

**The bundled version of dash.js is v2.2.0**
 
## Prerequisites

- Node.js v6 or later
- ruby v2 or later

## Quick start

### Clone this repo

```
git clone https://github.com/streamroot/dashjs-p2p-wrapper.git
```

### Install library dependencies

```
npm install
```

### Build the library

###### Unix
```
npm run build
```
The results will be in the destination folders `dist/wrapper` and `dist/bundle`.

###### Windows
```
scripts\clean.rb
scripts\dashjs.rb
scripts\dist_wrapper.rb
scripts\dist_bundle.rb
```
The results will be in the destination folders `dist\wrapper` and `dist\bundle`.

### Integration

Include either the bundle or the wrapper distro in your app and use it based on the respective examples.

```html
<head>
	<!-- path to dashjs-p2p-wrapper build -->
	<script src="dashjs-p2p-wrapper.js"></script>
</head>
```
or

```html
<head>
	<!-- path to dashjs-p2p-bundle build -->
	<script src="dashjs-p2p-bundle.js"></script>
</head>
```

Create a dash.js MediaPlayer instance and initialize the wrapper by yourself (see `example/index.html`):

```javascript
<body>
  	<div>
		<video id="videoPlayer" width="480" height="360" controls muted></video>
  	</div>

  	<script>
		(function() {
			var player = dashjs.MediaPlayer().create();

         	var p2pConfig = {
				streamrootKey: YOUR_STREAMROOT_KEY_HERE,
				debug: true //true if you want to see debug messages in browser console, false otherwise
			};

			var liveDelay = 30; //TODO: hardcoded value, will be fixed in future relases
			var dashjsWrapper = new DashjsWrapper(player, p2pConfig, liveDelay);

			var videoElementId = "videoPlayer";
			var videoElement = document.getElementById(videoElementId);
			var manifestURL = "example.mpd";
			var autoStart = true;
			player.initialize(videoElement, manifestURL, autoStart);
		})();
  	</script>
</body>
```
Or simply use the MediaPlayer bundle factory provided with `dashjs-p2p-bundle` (see (see `example/bundle.html`):

```javascript
var p2pConfig = {
	streamrootKey: YOUR_STREAMROOT_KEY_HERE,
	debug: true
};

var player = DashjsP2PBundle.MediaPlayer().create(p2pConfig);

var videoElementId = "videoPlayer";
var videoElement = document.getElementById(videoElementId);
var manifestURL = "example.mpd";
var autoStart = true;
player.initialize(videoElement, url, autoStart);
```

### Streamroot key

Specify your Streamroot key in the p2pConfig object. If you don't have it, go to [Streamroot's dashboard](http://dashboard.streamroot.io/) and sign up. It's free. You can check other p2pConfig options in the [documentation](https://streamroot.readme.io/docs/p2p-config).

## Run local example page

### Make sure you did at least once before

###### Unix
```
npm run build
```

###### Windows
```
scripts\clean.rb
scripts\dashjs.rb
scripts\dist_wrapper.rb
scripts\dist_bundle.rb
```

### Build wrapper

###### Unix
```
npm run wrapper
```

###### Windows
```
scripts\dist_wrapper.rb
```

### Build bundle

###### Unix
```
npm run bundle
```

###### Windows
```
scripts\dist_bundle.rb
```

### Launch the example

Start a local server like `http-server` or `node-static` in the project root, on port 8080 if you like.

Now visit [`http://localhost:8080/example`](http://localhost:8080/example)

To see some p2p traffic open several browser tabs/windows playing the same manifest (so there will be peers to exchange p2p traffic).