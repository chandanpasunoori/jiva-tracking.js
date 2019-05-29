var assert = require('proclaim');
var config = require('../helpers/client-config');
var Jiva = require('../../../lib/browser');

describe('Auto Tracking', function() {

  beforeEach(function() {
    this.client = new Jiva({
      projectId: config.projectId,
      writeKey: config.writeKey,
      requestType: 'xhr',
      host: config.host,
      protocol: config.protocol
    });
  });

  it('should capture "pageviews," "clicks," and "form submits"', function(){
    this.timeout(5000);
    var aNode = document.createElement('A');
    var bNode = document.createElement('BUTTON');
    var fNode = document.createElement('FORM');
    var iNode = document.createElement('INPUT');
    var pNode = document.createElement('INPUT');
    var inc = 0;

    this.client.on('recordEvent', function(stream, payload){
      if (stream === 'pageviews') {
        assert.equal(stream, 'pageviews');
        inc++;
      }
      else if (stream === 'clicks') {
        assert.equal(stream, 'clicks');
        assert.equal(payload.element.id, 'test-auto-tracker-clicks');
        assert.equal(payload.element.node_name, 'A');
        assert.isNumber(payload.page.time_on_page);
        aNode.outerHTML = '';
        inc++;
      }
      else if (stream === 'form_submissions') {
        assert.equal(stream, 'form_submissions');
        assert.equal(payload.element.id, 'test-auto-tracker-submits');
        assert.equal(payload.element.node_name, 'FORM');
        assert.equal(payload.form.fields.email, 'team@jiva.io');
        assert.notOk(payload.form.fields.password);
        assert.isNumber(payload.page.time_on_page);
        fNode.outerHTML = '';
        inc++;
      }
      // if (inc === 3) {
      //   done();
      // }
    });
    this.client.initAutoTracking();

    /*
      Anchor Tag Listener
    */
    aNode.id = 'test-auto-tracker-clicks';
    aNode.href = 'javascript:void(0);';
    aNode.onclick = function(e){
      e.preventDefault();
      return false;
    };
    document.body.appendChild(aNode);

    /*
      Form Listener
    */
    fNode.id = 'test-auto-tracker-submits';
    fNode.action = 'javascript:void(0);';
    fNode.onsubmit = function(e) {
      e.preventDefault();
      return false;
    };
    // fNode.style.display = 'none';

    iNode.type = 'text';
    iNode.name = 'email';
    iNode.value = 'team@jiva.io';

    pNode.type = 'password';
    pNode.name = 'password';
    pNode.value = '**********';

    bNode.type = 'submit';
    fNode.appendChild(iNode);
    fNode.appendChild(pNode);
    fNode.appendChild(bNode);
    document.body.appendChild(fNode);

    /*
      Init Behavior
    */
    // Init anchor click
    if (aNode.click) {
      aNode.click();
    }
    else if (document.createEvent) {
      var ev1 = document.createEvent('MouseEvent');
      ev1.initMouseEvent('click',
          true /* bubble */, true /* cancelable */,
          window, null,
          0, 0, 0, 0,
          false, false, false, false,
          0, null
      );
      aNode.dispatchEvent(ev1);
    }

    // Init form button click (submit)
    if (bNode.click) {
      bNode.click();
    }
    else if (document.createEvent) {
      var ev2 = document.createEvent('MouseEvent');
      ev2.initMouseEvent('click',
          true /* bubble */, true /* cancelable */,
          window, null,
          0, 0, 0, 0,
          false, false, false, false,
          0, null
      );
      bNode.dispatchEvent(ev2);
    }
  });

});
