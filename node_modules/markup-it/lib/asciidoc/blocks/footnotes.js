'use strict';

var _require = require('immutable'),
    Map = _require.Map;

var _require2 = require('../../'),
    Serializer = _require2.Serializer,
    BLOCKS = _require2.BLOCKS;

/**
 * Index all footnotes in the document.
 * @type {Serializer}
 */


var serialize = Serializer().then(function (state) {
    var depth = state.depth,
        nodes = state.nodes;

    var footnotes = {};

    if (depth > 2 || state.getProp('footnotes')) {
        return;
    }

    nodes = nodes.filter(function (node) {
        if (node.type !== BLOCKS.FOOTNOTE) {
            return true;
        }

        var inner = state.use('inline').serialize(node.nodes);
        var id = node.data.get('id');

        footnotes[id] = inner;

        return false;
    });

    return state.setProp('footnotes', Map(footnotes)).merge({ nodes: nodes });
});

module.exports = { serialize: serialize };