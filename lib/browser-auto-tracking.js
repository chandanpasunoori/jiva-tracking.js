var pkg = require('../package.json');
var MobileDetect = require('mobile-detect');
var Fingerprint2 = require('fingerprintjs2');
var _ = require('lodash');

function initAutoTracking(lib) {
  var fpg = new Fingerprint2();
  var md = new MobileDetect();
  if (md.is('bot')) {
    return false;
  }
  var fpz;
  var stime = new Date();
  fpg.get(function (result, components) {
    fpz = result;
    console.log("fpq stime", stime, "etime", new Date());
  });
  return function (obj) {
    var client = this;
    var helpers = lib.helpers;
    var utils = lib.utils;

    var options = utils.extend({
      ignoreDisabledFormFields: false,
      ignoreFormFieldTypes: ['password'],
      recordClicks: true,
      recordFormSubmits: true,
      recordPageViews: true,
      recordScrollState: true
    }, obj);

    var now = new Date();

    var cookie = new utils.cookie('jiva');
    var uuid = cookie.get('uuid');
    if (!uuid) {
      uuid = helpers.getUniqueId();
      cookie.set('uuid', uuid);
    }

    var fp = cookie.get('fp');
    if (!fp) {
      fp = fpz;
      cookie.set('fp', fp);
      if (fpz == null) console.log("fpz is still null");
    }

    var searchParams = new URLSearchParams(window.location.search);
    var queryParams = searchParams ? _.fromPairs(Array.from(searchParams.entries())) : {};

    var scrollState = {};
    if (options.recordScrollState) {
      scrollState = helpers.getScrollState();
      utils.listener('window').on('scroll', function () {
        scrollState = helpers.getScrollState(scrollState);
      });
    }

    client.extendEvents(function () {
      var browserProfile = helpers.getBrowserProfile();
      return {
        tracked_by: pkg.name + '-' + pkg.version,
        local_time_full: new Date(),
        user: {
          uuid: uuid,
          fp: fp
        },
        queryParams: queryParams,
        page: {
          title: document ? document.title : null,
          description: browserProfile.description,
          time_on_page: getSecondsSinceDate(now)
        },
        user_agent: window.navigator.userAgent,
        tech: {
          profile: browserProfile,
          device_type: md.tablet() ? 'tablet' : md.mobile() ? 'mobile' : 'desktop'
        },
        url: {
          full: window ? window.location.href : ''
        },

        referrer: {
          full: document ? document.referrer : ''
        },

        time: {
          timestamp: new Date().toISOString()
        }
      };
    });


    if (options.recordClicks === true) {
      utils.listener('a, a *').on('click', function (e) {
        var el = e.target;
        var props = {
          element: helpers.getDomNodeProfile(el),
          local_time_full: new Date(),
          page: {
            scroll_state: scrollState
          }
        };
        client.recordEvent('clicks', props);
      });
    }

    if (options.recordFormSubmits === true) {
      utils.listener('form').on('submit', function (e) {
        var el = e.target;
        var serializerOptions = {
          disabled: options.ignoreDisabledFormFields,
          ignoreTypes: options.ignoreFormFieldTypes
        };
        var props = {
          form: {
            action: el.action,
            fields: utils.serializeForm(el, serializerOptions),
            method: el.method
          },
          element: helpers.getDomNodeProfile(el),
          local_time_full: new Date(),
          page: {
            scroll_state: scrollState
          }
        };
        client.recordEvent('form_submissions', props);
      });
    }

    if (options.recordPageViews === true) {
      client.recordEvent('pageviews');
    }

    return client;
  };
}

function getSecondsSinceDate(date) {
  var diff = new Date().getTime() - date.getTime();
  return Math.round(diff / 1000);
}

module.exports = initAutoTracking;
