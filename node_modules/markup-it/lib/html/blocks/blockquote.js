'use strict';

var _require = require('../../'),
    Serializer = _require.Serializer,
    BLOCKS = _require.BLOCKS;

var serializeTag = require('../serializeTag');

/**
 * Serialize a blockquote to HTML
 * @type {Serializer}
 */
var serialize = Serializer().matchType(BLOCKS.BLOCKQUOTE).then(serializeTag('blockquote'));

module.exports = { serialize: serialize };