'use strict';

var _require = require('../../'),
    Serializer = _require.Serializer,
    INLINES = _require.INLINES;

/**
 * Serialize a link to Asciidoc
 * @type {Serializer}
 */


var serialize = Serializer().matchType(INLINES.LINK).then(function (state) {
    var node = state.peek();
    var nodes = node.nodes,
        data = node.data;

    var href = data.get('href', '');
    var inner = state.use('inline').serialize(nodes);

    return state.shift().write('link:' + href + '[' + inner + ']');
});

module.exports = { serialize: serialize };