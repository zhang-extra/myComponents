'use strict';

var splitLines = require('split-lines');

var _require = require('../../'),
    Serializer = _require.Serializer,
    Deserializer = _require.Deserializer,
    Block = _require.Block,
    BLOCKS = _require.BLOCKS;

var reBlock = require('../re/block');

/**
 * Serialize a blockquote node to markdown
 * @type {Serializer}
 */
var serialize = Serializer().matchType(BLOCKS.BLOCKQUOTE).then(function (state) {
    var node = state.peek();
    var inner = state.use('block').serialize(node.nodes);
    var lines = splitLines(inner.trim());

    var output = lines.map(function (line) {
        return line ? '> ' + line : '>';
    }).join('\n');

    return state.shift().write(output + '\n\n');
});

/**
 * Deserialize a blockquote to a node.
 * @type {Deserializer}
 */
var deserialize = Deserializer().matchRegExp(reBlock.blockquote, function (state, match) {
    var inner = match[0].replace(/^ *> ?/gm, '').trim();
    var nodes = state.use('block')
    // Signal to children that we are in a blockquote
    .setProp('blockquote', state.depth).deserialize(inner);
    var node = Block.create({
        type: BLOCKS.BLOCKQUOTE,
        nodes: nodes
    });

    return state.push(node);
});

module.exports = { serialize: serialize, deserialize: deserialize };