'use strict';

var _require = require('../../'),
    Serializer = _require.Serializer,
    Deserializer = _require.Deserializer,
    Block = _require.Block,
    BLOCKS = _require.BLOCKS;

var reBlock = require('../re/block');

/**
 * Serialize a footnote to markdown
 * @type {Serializer}
 */
var serialize = Serializer().matchType(BLOCKS.FOOTNOTE).then(function (state) {
    var node = state.peek();
    var inner = state.use('inline').serialize(node.nodes);
    var id = node.data.get('id');

    return state.shift().write('[^' + id + ']: ' + inner + '\n\n');
});

/**
 * Deserialize a footnote to a node.
 * @type {Deserializer}
 */
var deserialize = Deserializer().matchRegExp(reBlock.footnote, function (state, match) {
    var id = match[1];
    var text = match[2];
    var nodes = state.use('inline').deserialize(text);
    var node = Block.create({
        type: BLOCKS.FOOTNOTE,
        nodes: nodes,
        data: { id: id }
    });

    return state.push(node);
});

module.exports = { serialize: serialize, deserialize: deserialize };