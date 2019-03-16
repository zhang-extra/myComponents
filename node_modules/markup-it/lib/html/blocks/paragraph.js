'use strict';

var _require = require('../../'),
    Serializer = _require.Serializer,
    BLOCKS = _require.BLOCKS;

var serializeTag = require('../serializeTag');

/**
 * Serialize a paragraph to HTML
 * @type {Serializer}
 */
var serialize = Serializer().matchType(BLOCKS.PARAGRAPH).then(serializeTag('p'));

module.exports = { serialize: serialize };