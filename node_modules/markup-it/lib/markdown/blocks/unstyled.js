'use strict';

var _require = require('../../'),
    Serializer = _require.Serializer,
    Deserializer = _require.Deserializer,
    Block = _require.Block,
    BLOCKS = _require.BLOCKS;

var reBlock = require('../re/block');

/**
 * Serialize a unstyled node to markdown
 * @type {Serializer}
 */
var serialize = Serializer().matchType(BLOCKS.TEXT).then(function (state) {
    var node = state.peek();
    var inner = state.use('inline').serialize(node.nodes);

    return state.shift().write(inner + '\n');
});

/**
 * Deserialize a unstyle text to a node.
 * @type {Deserializer}
 */
var deserialize = Deserializer().matchRegExp(reBlock.text, function (state, match) {
    var inner = match[0];
    var nodes = state.use('inline').deserialize(inner);
    var node = Block.create({
        type: BLOCKS.TEXT,
        nodes: nodes
    });

    return state.push(node);
});

module.exports = { serialize: serialize, deserialize: deserialize };