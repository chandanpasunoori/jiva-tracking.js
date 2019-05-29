var JivaCore = require('@jiva/jiva-core');

var each = require('./utils/each'),
    extend = require('./utils/extend'),
    queue = require('./utils/queue');

JivaCore.helpers = JivaCore.helpers || {};

// Install internal queue
JivaCore.on('client', function(client){
  client.extensions = {
    events: [],
    collections: {}
  };
  client.queue = queue();
  client.queue.on('flush', function(){
    client.recordDeferredEvents();
  });
});

// Accessors
JivaCore.prototype.writeKey = function(str){
  if (!arguments.length) return this.config.writeKey;
  this.config.writeKey = (str ? String(str) : null);
  return this;
};

// DEPRECATED
JivaCore.prototype.setGlobalProperties = function(props){
  JivaCore.log('This method has been deprecated. Check out #extendEvents: https://github.com/etsrepo/jiva-tracking.js.git#extend-events');
  if (!props || typeof props !== 'function') {
    this.emit('error', 'Invalid value for global properties: ' + props);
    return;
  }
  this.config.globalProperties = props;
  return this;
};

module.exports = JivaCore;
