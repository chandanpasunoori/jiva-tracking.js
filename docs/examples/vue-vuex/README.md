# Vue vuex Logging

This example demonstrates how to instrument Jiva on [Vuex](https://vuex.vuejs.org/en/intro.html), capturing both the `mutations` and `state` data.

### Installation

Install this package from npm:

```ssh
$ npm install @jiva/jiva-tracking --save
```

Create a new file called `jiva-vuex-logger.js` where instrumentation and data modeling logic will live, or grab a copy [here](./jiva-vuex-logger.js).

```javascript
import Jiva from '@jiva/jiva-tracking';

// Record all mutations to a single event stream
const EVENT_STREAM_NAME = 'app-mutations';

// Omit noisy mutations if necessary
const OMITTED_MUTATIONS = [
  // 'KEYPRESS',
  // 'WINDOW_RESIZED'
];

// Define a client instance
const client = new Jiva({
  projectId: 'YOUR_PROJECT_ID',
  writeKey: 'YOUR_WRITE_KEY'
});
// make debug mode
Jiva.debug = true;
client.on('recordEvent', Jiva.log);

// Track a 'pageview' event and initialize auto-tracking data model
client.initAutoTracking({
  recordClicks: false,
  recordFormSubmits: false,
  recordPageViews: true
});

const vuexLogger = store => {
  // called when the store is initialized
  store.subscribe((mutation, state) => {
    // called after every mutation.
    // The mutation comes in the format of `{ type, payload }`.
    const eventBody = {
      'mutation': mutation,
      'state': state
      /*
        Include additional properties here, or
        refine the state data that is recorded
        by cherry-picking specific properties
      */
    };
    // Filter omitted mutations by action.type
    // ...or whatever you name this property
    if (OMITTED_MUTATIONS.indexOf(mutation.type) < 0) {
      client.recordEvent(EVENT_STREAM_NAME, eventBody);
    }
  })
};

export default vuexLogger;
```


### Instrument the Vuex Store

Next, import our new `jiva-vuex-logger` vuex plugin into your Store definition:

```javascript
import Vue from 'vue';
import Vuex from 'vuex';
import JivaVuexLogger from './jiva-vuex-logger.js';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
  actions,
  getters,
  modules,
  strict: debug,
  plugins: [ JivaVuexLogger ]
});
```
