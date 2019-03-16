'use strict';

var trimRight = require('trim-right');

var _require = require('../../'),
    Serializer = _require.Serializer,
    BLOCKS = _require.BLOCKS;

/**
 * Serialize a blockquote node to asciidoc
 * @type {Serializer}
 */


var serialize = Serializer().matchType(BLOCKS.BLOCKQUOTE).then(function (state) {
    var node = state.peek();
    var inner = state.use('block').serialize(node.nodes);

    return state.shift().write('___________\n' + trimRight(inner) + '\n___________\n\n');
});

module.exports = { serialize: serialize };