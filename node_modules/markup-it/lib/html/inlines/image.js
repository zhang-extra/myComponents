'use strict';

var _require = require('../../'),
    Serializer = _require.Serializer,
    INLINES = _require.INLINES;

var serializeTag = require('../serializeTag');

/**
 * Serialize an image to HTML
 * @type {Serializer}
 */
var serialize = Serializer().matchType(INLINES.IMAGE).then(serializeTag('img', {
    isSingleTag: true,
    getAttrs: function getAttrs(node) {
        return {
            src: node.data.get('src'),
            alt: node.data.get('alt')
        };
    }
}));

module.exports = { serialize: serialize };