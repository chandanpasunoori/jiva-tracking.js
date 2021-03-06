var Cookies = require('js-cookie');
var extend = require('./extend');

module.exports = cookie;

function cookie(str) {
  if (!arguments.length) return;
  if (this instanceof cookie === false) {
    return new cookie(str);
  }

  var zdomain = '.insuranceinbox.com';
  if (window.location.href.indexOf("insuranceinbox.in") !== -1) {
    zdomain = '.insuranceinbox.in';
  }
  if (window.location.href.indexOf("insuranceinbox.com") !== -1) {
    zdomain = '.insuranceinbox.com';
  }
  if (window.location.href.indexOf("jivadigital.com") !== -1) {
    zdomain = '.jivadigital.com';
  }
  if (window.location.href.indexOf("localhost") !== -1) {
    zdomain = 'localhost';
  }
  if (window.location.href.indexOf("127.0.0.1") !== -1) {
    zdomain = '127.0.0.1';
  }

  this.config = {
    key: str,
    options: {
      expires: 365,
      domain: zdomain
    }
  };
  this.data = this.get();
  return this;
}

cookie.prototype.get = function (str) {
  var data = {};

  if (Cookies.get(this.config.key)) {
    data = Cookies.getJSON(this.config.key);
  }
  if (str && typeof data === 'object' && typeof data !== null) {
    return (typeof data[str] !== 'undefined') ? data[str] : null;
  }
  else {
    return data;
  }
};

cookie.prototype.set = function (str, value) {
  if (!arguments.length || !this.enabled()) return this;
  if (typeof str === 'string' && arguments.length === 2) {
    this.data[str] = value ? value : null;
  }
  else if (typeof str === 'object' && arguments.length === 1) {
    extend(this.data, str);
  }
  Cookies.set(this.config.key, this.data, this.config.options);
  return this;
};

cookie.prototype.expire = function (daysUntilExpire) {
  if (daysUntilExpire) {
    Cookies.set(this.config.key, this.data, extend(this.config.options, {expires: daysUntilExpire}));
  } else {
    Cookies.remove(this.config.key);
    this.data = {};
  }
  return this;
};

cookie.prototype.options = function (obj) {
  if (!arguments.length) return this.config.options;
  this.config.options = (typeof obj === 'object') ? obj : {};
  return this;
};

cookie.prototype.enabled = function () {
  return navigator.cookieEnabled;
};
