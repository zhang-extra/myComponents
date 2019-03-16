'use strict';

var _require = require('../../'),
    Serializer = _require.Serializer,
    BLOCKS = _require.BLOCKS;

/**
 * Serialize an HTML block to HTML (pretty easy, huh?)
 * @type {Serializer}
 */


var serialize = Serializer().matchType(BLOCKS.HTML).then(function (state) {
    var node = state.peek();

    return state.shift().write(node.data.get('html') + '\n\n');
});

module.exports = { serialize: serialize };