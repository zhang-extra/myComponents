'use strict';

var _require = require('../../'),
    Serializer = _require.Serializer,
    BLOCKS = _require.BLOCKS;

var TYPES = [BLOCKS.HEADING_1, BLOCKS.HEADING_2, BLOCKS.HEADING_3, BLOCKS.HEADING_4, BLOCKS.HEADING_5, BLOCKS.HEADING_6];

/**
 * Serialize an heading node to asciidoc
 * @type {Serializer}
 */
var serialize = Serializer().matchType(TYPES).then(function (state) {
    var node = state.peek();
    var type = node.type,
        data = node.data;

    var id = data.get('id');

    var depth = TYPES.indexOf(type);
    var prefix = Array(depth + 2).join('=');

    var inner = state.use('inline').serialize(node.nodes);
    var prefixID = id ? '[[' + id + ']]\n' : '';

    return state.shift().write('' + prefixID + prefix + ' ' + inner + '\n\n');
});

module.exports = { serialize: serialize };