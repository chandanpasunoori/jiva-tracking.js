var assert = require('proclaim');

var serializeForm = require('../../../../lib/utils/serializeForm');

var ELEMENT_ID = 'test-serialize-form';
var INPUT_NAME = 'email';
var INPUT_VALUE = 'team@jiva.io';
var PASSWORD_NAME = 'password';
var PASSWORD_VALUE = 'password';

describe('Jiva.utils.serializeForm', function() {

  beforeEach(function(){
    var el = document.createElement('FORM');
    el.id = ELEMENT_ID;
    el.action = './';
    el.method = 'POST';
    document.body.appendChild(el);
    this.form = document.getElementById(ELEMENT_ID);

    var input = document.createElement('INPUT');
    input.name = INPUT_NAME;
    input.type = 'text';
    input.value = INPUT_VALUE;
    this.form.appendChild(input);

    var password = document.createElement('INPUT');
    password.name = PASSWORD_NAME;
    password.type = 'password';
    password.value = PASSWORD_VALUE;
    this.form.appendChild(password);
  });

  afterEach(function(){
    this.form.outerHTML = '';
  });

  it('should be a function', function() {
    assert.isFunction(serializeForm);
  });

  it('should accept a FORM element and return an object', function() {
    var serialized = serializeForm(this.form, { hash: true });
    assert.isObject(serialized);
    assert.ok(serialized.email);
    assert.ok(serialized.password);
  });

  it('should omit fields by type (password example)', function() {
    var serialized = serializeForm(this.form, {
      hash: true,
      ignoreTypes: ['password']
    });
    assert.isObject(serialized);
    assert.ok(serialized.email);
    assert.notOk(serialized.password);
  });

});
