(function(env) {
  'use strict';

  var JivaCore = require('./index');
  var each = require('./utils/each');
  var extend = require('./utils/extend');
  var listener = require('./utils/listener')(JivaCore);

  // ------------------------
  // Methods
  // ------------------------
  extend(JivaCore.prototype, require('./record-events-browser'));
  extend(JivaCore.prototype, require('./defer-events'));
  extend(JivaCore.prototype, {
    'extendEvent'      : require('./extend-events').extendEvent,
    'extendEvents'     : require('./extend-events').extendEvents
  });

  // ------------------------
  // Auto-Tracking
  // ------------------------
  extend(JivaCore.prototype, {
    'initAutoTracking': require('./browser-auto-tracking')(JivaCore)
  });

  // ------------------------
  // Deprecated
  // ------------------------
  JivaCore.prototype.trackExternalLink = trackExternalLink;

  // ------------------------
  // Helpers
  // ------------------------
  extend(JivaCore.helpers, {
    'getBrowserProfile'  : require('./helpers/getBrowserProfile'),
    'getDatetimeIndex'   : require('./helpers/getDatetimeIndex'),
    'getDomNodePath'     : require('./helpers/getDomNodePath'),
    'getDomNodeProfile'  : require('./helpers/getDomNodeProfile'),
    'getScreenProfile'   : require('./helpers/getScreenProfile'),
    'getScrollState'     : require('./helpers/getScrollState'),
    'getUniqueId'        : require('./helpers/getUniqueId'),
    'getWindowProfile'   : require('./helpers/getWindowProfile')
  });

  // ------------------------
  // Utils
  // ------------------------
  extend(JivaCore.utils, {
    'cookie'        : require('./utils/cookie'),
    'deepExtend'    : require('./utils/deepExtend'),
    'listener'      : listener,
    'serializeForm' : require('./utils/serializeForm'),
    'timer'         : require('./utils/timer')
  });

  JivaCore.listenTo = function(listenerHash){
    each(listenerHash, function(callback, key){
      var split = key.split(' ');
      var eventType = split[0],
          selector = split.slice(1, split.length).join(' ');
      // Create an unassigned listener
      return listener(selector).on(eventType, callback);
    });
  };

  // ------------------------------
  // DEPRECATED
  // Apply client.globalProperties
  // ------------------------------
  function trackExternalLink(jsEvent, eventCollection, payload, timeout, timeoutCallback){
    this.emit('error', 'This method has been deprecated. Check out DOM listeners: https://github.com/etsrepo/jiva-tracking.js.git#listeners');
    var evt = jsEvent,
      target = (evt.currentTarget) ? evt.currentTarget : (evt.srcElement || evt.target),
      timer = timeout || 500,
      triggered = false,
      targetAttr = '',
      callback,
      win;
    if (target.getAttribute !== void 0) {
      targetAttr = target.getAttribute('target');
    } else if (target.target) {
      targetAttr = target.target;
    }
    if ((targetAttr == '_blank' || targetAttr == 'blank') && !evt.metaKey) {
      win = window.open('about:blank');
      win.document.location = target.href;
    }
    if (target.nodeName === 'A') {
      callback = function(){
        if(!triggered && !evt.metaKey && (targetAttr !== '_blank' && targetAttr !== 'blank')){
          triggered = true;
          window.location = target.href;
        }
      };
    }
    else if (target.nodeName === 'FORM') {
      callback = function(){
        if(!triggered){
          triggered = true;
          target.submit();
        }
      };
    }
    else {
      this.trigger('error', '#trackExternalLink method not attached to an <a> or <form> DOM element');
    }
    if (timeoutCallback) {
      callback = function(){
        if(!triggered){
          triggered = true;
          timeoutCallback();
        }
      };
    }
    this.recordEvent(eventCollection, payload, callback);
    setTimeout(callback, timer);
    if (!evt.metaKey) {
      return false;
    }
  }

  // IE-specific polyfills, yay!
  // -----------------------------
  if (!Array.prototype.indexOf){
    Array.prototype.indexOf = function(elt /*, from*/) {
      var len = this.length >>> 0;

      var from = Number(arguments[1]) || 0;
      from = (from < 0)
           ? Math.ceil(from)
           : Math.floor(from);
      if (from < 0)
        from += len;

      for (; from < len; from++) {
        if (from in this &&
            this[from] === elt)
          return from;
      }
      return -1;
    };
  }


  // Module Definitions
  // --------------------

  // CommonJS
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = JivaCore;
  }

  // RequireJS
  if (typeof define !== 'undefined' && define.amd) {
    define('jiva-tracking', [], function(){
      return JivaCore;
    });
  }
  env.Jiva = JivaCore.extendLibrary(JivaCore);

}).call(this, typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {});
