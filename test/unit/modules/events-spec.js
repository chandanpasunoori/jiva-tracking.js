var assert = require('proclaim');
var Jiva = require('../../../lib/server');

describe('Jiva event emitter system', function(){

  beforeEach(function(){
    // Clear out events from previous tests
    Jiva.off();
  });

  describe('#on', function(){
    it('should attach custom event listeners with #on', function(){
      Jiva.on('event', function(){});
      assert.isArray(Jiva.listeners());
    });
  });

  describe('#trigger', function(){
    it('should call bound functions when triggered', function(done){
      var count = 0;
      Jiva.on('event', function(){
        count++;
        if (count === 1) {
          done();
        }
        else {
          throw Error('Called incorrectly');
        }
      });
      Jiva.emit('event');
    });

    it('should pass arguments to bound functions when triggered', function(done){
      var payload = { status: 'ok' }, count = 0;
      Jiva.on('event', function(data){
        count++;
        if (count === 1 && data.status === 'ok') {
          done();
        }
        else {
          throw Error('Called incorrectly');
        }
      });
      Jiva.emit('event', payload);
    });

    it('should call bound functions multiple when triggered multiple times', function(){
      // var callback = chai.spy();
      var count = 0;
      Jiva.on('event', function(){
        count++;
      });
      Jiva.emit('event');
      Jiva.emit('event');
      Jiva.emit('event');
      assert.equal(count, 3);
      // expect(callback).to.have.been.called.exactly(3);
    });
  });

  describe('#off', function(){
    it('should remove all listeners for an event name with #off(name)', function(){
      var count = 0;
      function callback(){
        count++;
      };
      Jiva.on('event', callback);
      Jiva.on('event', callback);
      Jiva.off('event');
      Jiva.emit('event');
      assert.equal(count, 0);
    });

    it('should remove specified listeners with #off(name, callback)', function(){
      var count = 0;
      function callback(){
        count++;
      }
      function fakeback(){
        throw Error('Don\'t call me!');
      };
      Jiva.on('event', callback);
      Jiva.on('event', fakeback);
      Jiva.off('event', fakeback);
      Jiva.emit('event');
      assert.equal(count, 1);
    });
  });

  describe('#once', function() {
    it('should call once handlers once when triggered', function(){
      var countA = 0, countB = 0;
      function callbackA(){
        countA++;
      }
      function callbackB(){
        countB++;
      }
      Jiva.once('event', callbackA);
      Jiva.once('event', callbackB);
      Jiva.emit('event');
      assert.equal(countA, 1);
      assert.equal(countB, 1);
      Jiva.emit('event');
      assert.equal(countA, 1);
      assert.equal(countB, 1);
    });
  });
});
