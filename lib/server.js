var Jiva = require('./');
var extend = require('./utils/extend');

// ------------------------
// Methods
// ------------------------
extend(Jiva.prototype, require('./record-events-server'));
extend(Jiva.prototype, require('./defer-events'));
extend(Jiva.prototype, {
  'extendEvent': require('./extend-events').extendEvent,
  'extendEvents': require('./extend-events').extendEvents
});

// ------------------------
// Helpers
// ------------------------
extend(Jiva.helpers, {
  'getDatetimeIndex'   : require('./helpers/getDatetimeIndex'),
  'getUniqueId'        : require('./helpers/getUniqueId')
});

// ------------------------
// Utils
// ------------------------
extend(Jiva.utils, {
  'deepExtend' : require('./utils/deepExtend'),
  'timer'      : require('./utils/timer')
});

Jiva.version = require('../package.json').version;

module.exports = Jiva;
