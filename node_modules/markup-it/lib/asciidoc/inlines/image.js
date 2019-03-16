'use strict';

var _require = require('../../'),
    Serializer = _require.Serializer,
    INLINES = _require.INLINES;

/**
 * Serialize an image to Asciidoc
 * @type {Serializer}
 */


var serialize = Serializer().matchType(INLINES.IMAGE).then(function (state) {
    var node = state.peek();
    var data = node.data;

    var src = data.get('src', '');
    var title = data.get('title', '');

    return state.shift().write('image:' + src + '[' + title + ']');
});

module.exports = { serialize: serialize };