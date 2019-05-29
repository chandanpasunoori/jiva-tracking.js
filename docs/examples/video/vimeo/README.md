# Vimeo Player

This example demonstrates how to instrument the [Vimeo video player](https://github.com/vimeo/player.js) to capture usage stats with Jiva IO.

### Installation

Install the library synchronously and configure a new `client` instance to capture events emitted by the Vimeo player.

```html
<html>
<head>
  <meta charset="utf-8">
  <script src="https://cdn.example.com/jiva-tracking.js/jiva-tracking.min.js"></script>
  <script src="https://player.vimeo.com/api/player.js"></script>
</head>
<body>
  <!-- Vimeo iFrame -->
  <iframe id="vimeo-player"
          src="https://player.vimeo.com/video/76979871"
          frameborder="0" height="360" width="640"
          webkitallowfullscreen
          mozallowfullscreen
          allowfullscreen></iframe>

  <script>
  Jiva.ready(function() {
    var iframe = document.querySelector('#vimeo-player');
    var player = new Vimeo.Player(iframe);

    var client = new Jiva({
      projectId: 'YOUR_PROJECT_ID',
      writeKey: 'YOUR_WRITE_KEY'
    });
    var extend = Jiva.utils.extend;

    // Optional debug mode
    Jiva.debug = true;
    client.on('recordEvent', Jiva.log);

    // Track a 'pageview' event and initialize auto-tracking data model
    client.initAutoTracking({
      recordClicks: false,
      recordFormSubmits: false,
      recordPageViews: true
    });

    /*
      Vimeo Events
    */
    player.on('play', function() {
      getPlayerState(player, function(state){
        client.recordEvent('video-interaction', extend(state, { event_type: 'started' }));
      });
    });

    player.on('pause', function() {
      getPlayerState(player, function(state){
        client.recordEvent('video-interaction', extend(state, { event_type: 'paused' }));
      });
    });

    player.on('ended', function() {
      getPlayerState(player, function(state){
        client.recordEvent('video-interaction', extend(state, { event_type: 'finished' }));
      });
    });

    player.on('error', function() {
      getPlayerState(player, function(state){
        client.recordEvent('video-interaction', extend(state, { event_type: 'error' }));
      });
    });
  });

  /*
    Vimeo Handlers
  */
  function getPlayerState(p, cb){
    p.getVolume().then(function(volume){
      p.getCurrentTime().then(function(time){
        p.getDuration().then(function(duration){
          cb({
            'is-muted': volume === 0,
            'current-position': time,
            'duration': duration,
            'volume': volume
          })
        }).catch(handleStateError);
      }).catch(handleStateError);
    }).catch(handleStateError);
  }

  function handleStateError(err) {
    console.log(err);
  }
  </script>
</body>
</html>
```
