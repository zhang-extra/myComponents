const { Serializer, BLOCKS } = require('../../');
const serializeTag = require('../serializeTag');

/**
 * Serialize a paragraph to HTML
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchType(BLOCKS.PARAGRAPH)
    .then(serializeTag('p'));

module.exports = { serialize };
