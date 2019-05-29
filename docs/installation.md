# Installation

Install this package from npm:

```ssh
$ npm install @jiva/jiva-tracking --save
```

Or load it from our CDN:

```html
<script src="https://cdn.example.com/jiva-tracking.js/jiva-tracking.min.js"></script>
```

Prefer asynchronous loading? Copy/paste this snippet of JavaScript above the `</head>` tag of your page to load the tracking library asynchronously. This technique sneaks the library into your page without significantly impacting page load speed.

```html
<script>
// Loads the library asynchronously from any URI
!function(name,path,ctx){
  var latest,prev=name!=='Jiva'&&window.Jiva?window.Jiva:false;ctx[name]=ctx[name]||{ready:function(fn){var h=document.getElementsByTagName('head')[0],s=document.createElement('script'),w=window,loaded;s.onload=s.onreadystatechange=function(){if((s.readyState&&!(/^c|loade/.test(s.readyState)))||loaded){return}s.onload=s.onreadystatechange=null;loaded=1;latest=w.Jiva;if(prev){w.Jiva=prev}else{try{delete w.Jiva}catch(e){w.Jiva=void 0}}ctx[name]=latest;ctx[name].ready(fn)};s.async=1;s.src=path;h.parentNode.insertBefore(s,h)}}
}('Jiva','https://cdn.example.com/jiva-tracking.js/jiva-tracking.min.js',this);

// Executes when the library is loaded and ready
Jiva.ready(function(){

  // Create a new client instance
  var client = new Jiva({
    projectId: 'YOUR_PROJECT_ID',
    writeKey: 'YOUR_WRITE_KEY'
  });

  // Record an event!
  client.recordEvent('pageviews', {
    // Define your event data model
    title: document.title
  });

});
</script>
```

This loader works a little differently than all the previous versions we have released.

Notice the last line of the asynchronous loader snippet: `}('Jiva', './filename.js', this);`. These three arguments can be overwritten, allowing you to customize important details about the installation process.

1. **Namespace:** Define a custom namespace for the library, instead of the default `Jiva`, like `MyCustomJivaBuild`.
2. **Script URI:** Define the location of the script to load. You don't need to rely on our CDN. You can use your own, or host the file locally.
3. **Context:** Define where the library should be installed. Global pollution is a problem. This helps you fight back.

Here's an example that uses all of these features together:

```javascript
var modules = {};
!function(name,path,ctx){
  //~ .etc
}('MyJivaBuild','/assets/js/custom-jiva-tracking.js', modules);

modules.MyJivaBuild.ready(function(){
  var client = new modules.MyJivaBuild.Client({
    projectId: 'YOUR_PROJECT_ID',
    writeKey: 'YOUR_WRITE_KEY'
  });
  // client.recordEvent('pageviews', {});
});
```

**Important:** This update brings an important change to note. In past versions of jiva-js, we shimmed tracking-methods so you could begin using them immediately without the `.ready()` callback wrapper. This created a lot of strange edge cases and version conflicts. Now, everything must be initialized from within the `.ready(function(){ ... })` wrapper.


### RequireJS

The library is published with an explicitly named module ID of 'jiva-tracking'. This presents a light configuration step, but prevents anonymous define() mismatch mayhem.

To use this module, configure a paths record, like so:

```html
<script data-main="path/to/app.js" src="require.js"></script>
```

```javascript
// app.js
requirejs.config({
  paths: {
    'jiva-tracking': 'path/to/jiva-tracking.js'
  }
});

require([
    'jiva-tracking'
  ], function(JivaAMD) {

    var client = new JivaAMD.Client({
      projectId: "123",
      writeKey: "456"
    });
});
```

Also note a global `Jiva` object will still be defined. This is meant to ensure the library can initialize in environments where neighboring scripts are unknown or uncontrollable.


## Client instances

The client instance is the core of the library and will be required for all API-related functionality. The `client` variable defined below will also be used throughout this document.

```javascript
import Jiva from '@jiva/jiva-tracking';

const client = new Jiva({
  projectId: 'YOUR_PROJECT_ID',
  writeKey: 'YOUR_WRITE_KEY',
  host: 'api.jiva.io',
  protocol: 'https',
  requestType: 'jsonp' // Also: 'xhr', 'beacon'
});

// Optional accessor methods are available too
client.projectId('PROJECT_ID');
client.writeKey('WRITE_KEY');
```

**Important notes about client configuration options:**

* `host` and `writePath`: these options can be overwritten to make it easier than ever to proxy events through your own intermediary host.
* `protocol`: older versions of IE feature a fun little quirk where cross-domain requests to a secure resource (https) from an insecure host (!https) fail. In these rare cases the library will match the current host's protocol.
* `requestType`: this option sets a default for GET requests, which is only supported when recording single events. There are limits to the URL string length of a request, so if this limit is exceeded we'll attempt to execute a POST instead, using XHR. In rare cases where XHR isn't supported, the request will fail.
