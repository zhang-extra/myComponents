'use strict';

var _require = require('../../'),
    Serializer = _require.Serializer,
    BLOCKS = _require.BLOCKS;

/**
 * Serialize an unstyled block to HTML
 * @type {Serializer}
 */


var serialize = Serializer().matchType(BLOCKS.TEXT).then(function (state) {
    // Ignore the block, but still serialize its content
    var node = state.peek();
    return state.shift().write(state.serialize(node.nodes));
});

module.exports = { serialize: serialize };