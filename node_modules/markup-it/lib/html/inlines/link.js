'use strict';

var _require = require('../../'),
    Serializer = _require.Serializer,
    INLINES = _require.INLINES;

var serializeTag = require('../serializeTag');
var escape = require('../escape');

/**
 * Serialize a link to HTML
 * @type {Serializer}
 */
var serialize = Serializer().matchType(INLINES.LINK).then(serializeTag('a', {
    getAttrs: function getAttrs(_ref) {
        var data = _ref.data;

        return {
            href: escape(data.get('href') || ''),
            title: data.get('title') ? escape(data.get('title')) : undefined
        };
    }
}));

module.exports = { serialize: serialize };