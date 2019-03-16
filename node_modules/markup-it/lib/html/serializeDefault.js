'use strict';

var _require = require('../'),
    Serializer = _require.Serializer;

/**
 * Default rule to serialize to HTML. Should be removed in the end.
 * @type {Serializer}
 */


var serialize = Serializer().then(function (state) {
  return state.shift();
});

module.exports = { serialize: serialize };