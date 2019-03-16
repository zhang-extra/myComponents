'use strict';

var _require = require('../../'),
    Serializer = _require.Serializer,
    BLOCKS = _require.BLOCKS;

/**
 * Serialize an HR to asciidoc
 * @type {Serializer}
 */


var serialize = Serializer().matchType(BLOCKS.HR).then(function (state) {
    return state.shift().write('\'\'\'\n\n');
});

module.exports = { serialize: serialize };