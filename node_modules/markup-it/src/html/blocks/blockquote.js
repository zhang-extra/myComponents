const { Serializer, BLOCKS } = require('../../');
const serializeTag = require('../serializeTag');

/**
 * Serialize a blockquote to HTML
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchType(BLOCKS.BLOCKQUOTE)
    .then(serializeTag('blockquote'));

module.exports = { serialize };
