var assert = require('proclaim');
var Jiva = require('../../../lib/server');
var config = require('../helpers/client-config');

describe('.deferEvent(s) methods', function() {

  beforeEach(function() {
    Jiva.enabled = false;
    this.client = new Jiva({
      projectId: config.projectId,
      writeKey: config.writeKey,
      requestType: 'xhr',
      host: config.host,
      protocol: config.protocol
    });
  });

  it('should have a queue', function(){
    assert.isObject(this.client.queue);
  });

  it('should overwrite capacity and interval settings with accessor methods', function(){
    this.client.queueCapacity(10);
    this.client.queueInterval(10);
    assert.equal(this.client.queue.config.capacity, 10);
    assert.equal(this.client.queue.config.interval, 10);
  });

  it('should push individual deferred events into a queue', function(){
    this.client.deferEvent('deferred event', { test: 'data' });
    assert.isArray(this.client.queue.events['deferred event']);
    assert.deepEqual(this.client.queue.events['deferred event'][0], { test: 'data' });
  });

  it('should push sets of deferred events into a queue', function(){
    this.client.deferEvents({
      'deferred event': [{ test: 'data' }, { test: 'none' }],
      'another event': [{ test: 'data' }]
    });
    assert.isArray(this.client.queue.events['deferred event']);
    assert.isArray(this.client.queue.events['another event']);
    assert.deepEqual(this.client.queue.events['deferred event'][0], { test: 'data' });
    assert.deepEqual(this.client.queue.events['deferred event'][1], { test: 'none' });
    assert.deepEqual(this.client.queue.events['another event'][0], { test: 'data' });
  });

  it('should attempt to record events from the queue at given interval', function(){
    this.timeout(5000);
    this.client.queueInterval(2);
    this.client.on('recordDeferredEvents', function(data){
      assert.isObject(data);
      assert.isArray(data['deferred event']);
      assert.isArray(data['another event']);
      assert.deepEqual(data['deferred event'][0], { test: 'data' });
      assert.deepEqual(data['deferred event'][1], { test: 'none' });
      assert.deepEqual(data['another event'][0], { test: 'data' });
    });
    this.client.deferEvents({
      'deferred event': [{ test: 'data' }, { test: 'none' }],
      'another event': [{ test: 'data' }]
    });
  });

  it('should attempt to record events from the queue when capacity is met', function(){
    this.timeout(5000);
    this.client.queueCapacity(3);
    this.client.on('recordDeferredEvents', function(data){
      assert.isObject(data);
      assert.isArray(data['deferred event']);
      assert.isArray(data['another event']);
      assert.deepEqual(data['deferred event'][0], { test: 'data' });
      assert.deepEqual(data['deferred event'][1], { test: 'none' });
      assert.deepEqual(data['another event'][0], { test: 'data' });
    });
    this.client.deferEvents({
      'deferred event': [{ test: 'data' }, { test: 'none' }],
      'another event': [{ test: 'data' }]
    });
  });

  it('should attempt to record events when .recordDeferredEvents is called', function(){
    this.timeout(5000);
    this.client.on('recordDeferredEvents', function(data){
      assert.isObject(data);
      assert.isArray(data['deferred event']);
      assert.isArray(data['another event']);
      assert.deepEqual(data['deferred event'][0], { test: 'data' });
      assert.deepEqual(data['deferred event'][1], { test: 'none' });
      assert.deepEqual(data['another event'][0], { test: 'data' });
    });
    this.client.deferEvents({
      'deferred event': [{ test: 'data' }, { test: 'none' }],
      'another event': [{ test: 'data' }]
    });
    this.client.recordDeferredEvents();
  });

  it('should not have an internal queue timer until an event is added to the queue', function(){
    assert.isNull(this.client.queue.timer);
    this.client.deferEvent('single-deferred-event', { prop: true });
    assert.ok(this.client.queue.timer);
  });

  it('should not have an internal queue timer until multiple events are added to the queue', function(){
    assert.isNull(this.client.queue.timer);
    this.client.deferEvents({
      'deferred event': [{ test: 'data' }, { test: 'none' }],
      'another event': [{ test: 'data' }]
    });
    assert.ok(this.client.queue.timer);
  });

  it('should clear internal queue timer when .queueInterval() is set to 0', function(){
    assert.isNull(this.client.queue.timer);
    this.client.deferEvent('single-deferred-event', { prop: true });
    assert.ok(this.client.queue.timer);
    this.client.queueInterval(0);
    assert.isNull(this.client.queue.timer);
  });

});
