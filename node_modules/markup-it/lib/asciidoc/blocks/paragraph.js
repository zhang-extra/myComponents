'use strict';

var _require = require('../../'),
    Serializer = _require.Serializer,
    BLOCKS = _require.BLOCKS;

/**
 * Serialize a paragraph node to asciidoc
 * @type {Serializer}
 */


var serialize = Serializer().matchType(BLOCKS.PARAGRAPH).then(function (state) {
    var node = state.peek();
    var inner = state.use('inline').serialize(node.nodes);

    return state.shift().write(inner + '\n\n');
});

module.exports = { serialize: serialize };