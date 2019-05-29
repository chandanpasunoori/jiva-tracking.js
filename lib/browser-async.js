!function(name, path, ctx) {
  var latest, prev = name !== 'Jiva' && window['Jiva'] ? window['Jiva'] : false;
  ctx[name] = ctx[name] || {
    ready: function(fn) {
      var h = document.getElementsByTagName('head')[0],
          s = document.createElement('script'),
          w = window, loaded;
      s.onload = s['onreadystatechange'] = function () {
        if ( (s['readyState'] && !(/^c|loade/.test(s['readyState'])) ) || loaded) return;
        s.onload = s['onreadystatechange'] = null;
        loaded = 1;
        // noConflict
        latest = w.Jiva;
        if (prev) {
          w.Jiva = prev;
        }
        else {
          try { delete w.Jiva; }
          catch(e) { w.Jiva = void 0; }
        }
        ctx[name] = latest;
        ctx[name].ready(fn);
      }
      s.async = 1;
      s.src = path;
      h.parentNode.insertBefore(s, h);
    }
  };
}('Jiva', './jiva-tracking.js', this);

/*!

  ----------------------------------------------------------------------
  Example Usage:
  1) Namespace: Define a custom namespace for the library
  2) Script URI: Define the location of the script to load
  3) Context: Define where the library should be installed
  ----------------------------------------------------------------------

  var modules = {};
  !function(name, path, ctx) {
    // ... etc
  }('MyJiva', './my-jiva-build.js', modules);

  modules.MyJiva.ready(function(){
    var client = new modules.MyJiva.Client({
      projectId: '123',
      writeKey: '4324543'
    });
  });

*/
