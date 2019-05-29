# React Flux Logging

This example demonstrates how to instrument a Flux [ReduceStore](https://github.com/facebook/flux/blob/master/docs/Flux-Utils.md#usage), capturing both the `action` and `state` data.

### Installation

Install this package from npm:

```ssh
$ npm install @jiva/jiva-tracking --save
```

Create a new file called `jiva-flux-logger.js` where instrumentation and data modeling logic will live, or grab a copy [here](./jiva-flux-logger.js).

```javascript
import Jiva from '@jiva/jiva-tracking';

// Record all actions to a single event stream
const EVENT_STREAM_NAME = 'app-actions';

// Omit noisy actions if necessary
const OMITTED_ACTIONS = [
  // 'KEYPRESS',
  // 'WINDOW_RESIZED'
];

// Define a client instance
const client = new Jiva({
  projectId: 'PROJECT_ID',
  writeKey: 'WRITE_KEY'
});

if (process.env.NODE_ENV !== 'production') {
  // Optionally prevent recording in dev mode
  Jiva.enabled = false;
  // Display events in the browser console
  client.on('recordEvent', JivaTracking.log);
}

// Track a 'pageview' event and initialize auto-tracking data model
client.initAutoTracking({
  recordClicks: false,
  recordFormSubmits: false,
  recordPageViews: true
});

const fluxLogger = function(state, action) {
  const eventBody = {
    'action': action,
    'state': state
    /*
        Include additional properties here, or
        refine the state data that is recorded
        by cherry-picking specific properties
    */
  };
  // Filter omitted actions by action.type
  // ...or whatever you name this property
  if (OMITTED_ACTIONS.indexOf(action.type) < 0) {
    client.recordEvent(EVENT_STREAM_NAME, eventBody);
  }
}

export default fluxLogger;
```


### Instrument the Store

Next, import our new `jiva-flux-logger` module into your Store definition:

```javascript
import { ReduceStore } from 'flux/utils';
import AppDispatcher from './app-dispatcher';
import JivaFluxLogger from './jiva-flux-logger';

class Store extends ReduceStore {
  constructor() {
    super(AppDispatcher);
  }

  getInitialState() {
    return {
      is_logged_in: false
      /* State */
    };
  }

  reduce(state, action) {
    switch (action.type) {
      case 'USER_LOGGED_IN':
        state.is_logged_in = true;
        return state;

      case 'USER_LOGGED_OUT':
        state.is_logged_in = false;
        return state;

      default:
        return state;
    }
    JivaFluxLogger(state, action);
  }
}

module.exports = new Store();
```
