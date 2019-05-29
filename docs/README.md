# Documentation

* [Installation](./installation.md)
* [Automated tracking (browser-only)](./auto-tracking.md) to capture `pageviews`, `clicks`, and `form_submissions`
* [Record events](./record-events.md) to the API individually or in batches
* [Extend events](./extend-events.md) to build intricate, useful data models and ease instrumentation
* [Defer events](./defer-events.md) to be recorded at a given interval, or when the queue reaches a given capacity

---

### Examples

**App Frameworks:**

* [React Flux Logger](./examples/react-flux): How to instrument a Flux ReduceStore
* [React Redux Middleware](./examples/react-redux-middleware): How to instrument a Redux Store
* [Vue.js Vuex Store](./examples/vue-vuex): How to instrument a Vue Vuex Store

**Video Players:**

* [Facebook video player](./examples/video/facebook-video)
* [HTML5 video player](./examples/video/html5)
* [Video.js player](./examples/video/video-js)
* [Vimeo video player](./examples/video/vimeo)
* [Youtube iFrame video player](./examples/video/youtube)

---

### Utilities

* [Cookies](./cookies.md) (browser-only) for persisting data from one page to the next
* [Listeners](./listeners.md) (browser-only) for capturing and taking action during common DOM events like click, scroll, and submit
* [Timers](./timers.md) for tracking time before and between user or system interactions

---

### Helpers

* [Datetime index](./helpers.md#datetime-index) for decomposing a date object into a set of properties like "hour_of_day" or "day_of_month"
* [Unique ID](./helpers.md#unique-id) for generating UUIDs
* [DOM node path](./helpers.md#dom-node-path) for returning the xPath for a given DOM element
* [Screen profile](./helpers.md#screen-profile) for generating a set of properties describing the current device screen, like "height", "availHeight", and "orientation"
* [Window profile](./helpers.md#window-profile) for generating a set of properties describing the current window, like "height", "scrollHeight", and "ratio" to screen dimensions
* [Browser profile](./helpers.md#browser-profile) for generating a set of properties describing the current browser, like "useragent", "online" status, and "language", plus [screen](./helpers.md#screen-profile) and [window](./helpers.md#window-profile) profiles
* [Scroll state](./helpers/#scroll-state) for generating a set of properties profiling the current scroll state of the window
---

### Debugging

Dev console errors and messages are turned off by default, but can be activated by setting `Jiva.debug = true;`. Additionally, you can disable writing events to the API by setting `Jiva.enabled = false;`.

```javascript
import Jiva from '@jiva/jiva-tracking';

// Track errors and messages in the dev console
Jiva.debug = true;

// Disable event writes to the API
Jiva.enabled = false;

const client = new Jiva({ /*configure*/ });

// Observe what's happening in each method
client.on('recordEvent', Jiva.log);
client.on('recordEvents', Jiva.log);
client.on('deferEvent', Jiva.log);
client.on('deferEvents', Jiva.log);
client.on('recordDeferredEvents', Jiva.log);
client.on('extendEvent', Jiva.log);
client.on('extendEvents', Jiva.log);
```

---

### Contributing

This is an open source project and we love involvement from the community! Hit us up with pull requests and issues.

[Learn more about contributing to this project](../CONTRIBUTING.md).

---

### Support

Need a hand with something? Shoot us an email at [team@jiva.io](mailto:team@jiva.io). We're always happy to help, or just hear what you're building! Here are a few other resources worth checking out:

* [API status](http://status.jiva.io/)
* [API reference](https://jiva.io/docs/api)
* [How-to guides](https://jiva.io/guides)
* [Data modeling guide](https://jiva.io/guides/data-modeling-guide/)
* [Slack (public)](http://slack.jiva.io/)
