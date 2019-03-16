'use strict';

var _require = require('../../'),
    Serializer = _require.Serializer,
    BLOCKS = _require.BLOCKS;

/**
 * Serialize a paragraph node to asciidoc
 * @type {Serializer}
 */


var serialize = Serializer().matchType(BLOCKS.CODE).then(function (state) {
    var node = state.peek();
    var nodes = node.nodes,
        data = node.data;

    var syntax = data.get('syntax');

    var inner = nodes.reduce(function (output, line) {
        return output + line.text + '\n';
    }, '');

    return state.shift().write((syntax ? '[source,' + syntax + ']\n' : '') + '----\n' + inner + '----\n\n');
});

module.exports = { serialize: serialize };