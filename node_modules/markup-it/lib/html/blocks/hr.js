'use strict';

var _require = require('../../'),
    Serializer = _require.Serializer,
    BLOCKS = _require.BLOCKS;

var serializeTag = require('../serializeTag');

/**
 * Serialize an horizontal rule to HTML
 * @type {Serializer}
 */
var serialize = Serializer().matchType(BLOCKS.HR).then(serializeTag('hr', {
    isSingleTag: true
}));

module.exports = { serialize: serialize };