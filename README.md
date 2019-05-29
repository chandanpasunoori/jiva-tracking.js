# jiva-tracking.js

### Installation

Load it from our CDN:

```html
<script src="https://cdn.example.com/jiva-tracking.js/jiva-tracking.min.js"></script>
```

[Read about more installation options here](./docs/installation.md)

## Getting started

The following examples demonstrate how to implement rock-solid web analytics, capturing **pageviews**, **clicks**, and **form submissions** with robust data models.

Not interested in web analytics? Use these examples as a primer for getting up and running quickly. These examples also make use of several [helpers](./docs/#helpers) and [utilities](./docs/#utilities) that were designed to address common requirements and help produce insightful, valuable data models.

[Full documentation is available here](./docs/README.md)

**Using React? Check out these setup guides:**

* [React Flux Logger](./docs/examples/react-flux): How to instrument a Flux ReduceStore
* [React Redux Middleware](./docs/examples/react-redux-middleware): How to instrument a Redux Store

**Looking for compute capabilities?** Check out [jiva-analysis.js](https://github.com/jiva/jiva-analysis.js).

**Upgrading from an earlier version of jiva-js?** [Read this](./docs/upgrade-guide.md).

---

### Automated Event Tracking (browser-only)

Automatically record `pageviews`, `clicks`, and `form_submissions` events with robust data models:

```html
<script src="https://cdn.example.com/jiva-tracking.js/jiva-tracking.min.js"></script>
<script>
Jiva.ready(function(){
  var client = new Jiva({
    projectId: 'YOUR_PROJECT_ID',
    writeKey: 'YOUR_WRITE_KEY'
  });
  client.initAutoTracking();
});
</script>
```

[Learn how to configure and customize this functionality here](./docs/auto-tracking.md)

---

### Pageview Tracking

First, let's create a new `client` instance with your Project ID and Write Key, and use the `.extendEvents()` method to define a solid baseline data model that will be applied to every single event that is recorded. Consistent data models and property names make life much easier later on, when analyzing and managing several event streams. This setup also includes our [data enrichment add-ons](https://jiva.io/docs/streams/data-enrichment-overview/), which will populate additional information when an event is received on our end.

```javascript
import Jiva from '@jiva/jiva-tracking';

const client = new Jiva({
  projectId: 'PROJECT_ID',
  writeKey: 'WRITE_KEY'
});
const helpers = Jiva.helpers;
const utils = Jiva.utils;

const sessionCookie = utils.cookie('rename-this-example-cookie');
if (!sessionCookie.get('guest_id')) {
  sessionCookie.set('guest_id', helpers.getUniqueId());
}

client.extendEvents(() => {
  return {
    geo: {
      info: { /* Enriched */ },
      ip_address: '${jiva.ip}',
    },
    page: {
      info: { /* Enriched */ },
      title: document.title,
      url: document.location.href
    },
    referrer: {
      info: { /* Enriched */ },
      url: document.referrer
    },
    tech: {
      browser: helpers.getBrowserProfile(),
      info: { /* Enriched */ },
      user_agent: '${jiva.user_agent}'
    },
    time: helpers.getDatetimeIndex(),
    visitor: {
      guest_id: sessionCookie.get('guest_id')
      /* Include additional visitor info here */
    },
    jiva: {
      addons: [
        {
          name: 'jiva:ip_to_geo',
          input: {
            ip: 'geo.ip_address'
          },
          output : 'geo.info'
        },
        {
          name: 'jiva:ua_parser',
          input: {
            ua_string: 'tech.user_agent'
          },
          output: 'tech.info'
        },
        {
          name: 'jiva:url_parser',
          input: {
            url: 'page.url'
          },
          output: 'page.info'
        },
        {
          name: 'jiva:referrer_parser',
          input: {
            referrer_url: 'referrer.url',
            page_url: 'page.url'
          },
          output: 'referrer.info'
        }
      ]
    }
  }
});

client.recordEvent('pageview', {});
```

Every event that is recorded will inherit this baseline data model. Additional properties defined in `client.recordEvent()` will be applied before the event is finally recorded.

Want to get up and running faster? This can also be achieved in the browser with [automated event tracking](./docs/auto-tracking.md).

**What else can this SDK do?**

* [Automated tracking (browser-only)](./docs/auto-tracking.md)
* [Record multiple events in batches](./docs/record-events.md)
* [Extend event data models for a single event stream](./docs/extend-events.md)
* [Queue events to be recorded at a given time interval](./docs/defer-events.md)

**App Frameworks:**

* [React Flux Logger](./docs/examples/react-flux): How to instrument a Flux ReduceStore
* [React Redux Middleware](./docs/examples/react-redux-middleware): How to instrument a Redux Store
* [Vue.js Vuex Store](./docs/examples/vue-vuex): How to instrument a Vue Vuex Store

**Video Players:**

* [Facebook video player](./docs/examples/video/facebook-video)
* [HTML5 video player](./docs/examples/video/html5)
* [Video.js player](./docs/examples/video/video-js)
* [Vimeo video player](./docs/examples/video/vimeo)
* [Youtube iFrame video player](./docs/examples/video/youtube)

[Full documentation is available here](./docs/README.md)

---

### Click and Form Submit Tracking

Clicks and form submissions can be captured with `.listenTo()`. This function intercepts events for designated elements and creates a brief 500ms delay, allowing an HTTP request to execute before the page begins to unload.

This example further extends the `client` instance defined previously, and activates a simple timer when the page the loaded. Once a `click` or `submit` event is captured, the timer's value will be recorded as `visitor.time_on_page`.

```javascript
import Jiva from '@jiva/jiva-tracking';

const client = new Jiva({
  projectId: 'PROJECT_ID',
  writeKey: 'WRITE_KEY'
});
const helpers = Jiva.helpers;
const timer = Jiva.utils.timer();
timer.start();

Jiva.listenTo({
  'click .nav a': function(e){
    client.recordEvent('click', {
      action: {
        intent: 'navigate',
        target_path: helpers.getDomNodePath(e.target)
      },
      visitor: {
        time_on_page: timer.value()
      }
    });
  },
  'submit form#signup': function(e){
    client.recordEvent('form-submit', {
      action: {
        intent: 'signup',
        target_path: helpers.getDomNodePath(e.target)
      },
      visitor: {
        email_address: document.getElementById('signup-email').value,
        time_on_page: timer.value()
      }
    });
  }
});
```

Want to get up and running faster? This can also be achieved in the browser with [automated event tracking](./docs/auto-tracking.md).

---

### Block Bots and Improve Device Recognition

Install [mobile-detect.js](https://github.com/hgoebl/mobile-detect.js) to identify basic device types and block noisy bots and crawlers.

```ssh
$ npm install mobile-detect --save
```

This example further extends the `client` instance defined above, inserting a new `tech.device_type` property with three possible values: `'desktop'`, `'mobile'`, and `'tablet'`. If the user agent is determined to be a bot, it may be ideal to abort and avoid recording an event.

```javascript
import MobileDetect from 'mobile-detect';

const md = new MobileDetect();
if (md.is('bot')) {
  return false;
}

// extends client instance defined previously
client.extendEvents(() => {
  return {
    tech: {
      device_type: md.tablet() ? 'tablet' : md.mobile() ? 'mobile' : 'desktop'
    }
  };
});
```

Check out the many additional methods supported by [mobile-detect.js](https://github.com/hgoebl/mobile-detect.js) to further enrich your data model.

This can also be used with [automated event tracking](./docs/auto-tracking.md).
