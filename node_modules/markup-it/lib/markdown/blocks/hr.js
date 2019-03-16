'use strict';

var _require = require('../../'),
    Serializer = _require.Serializer,
    Deserializer = _require.Deserializer,
    Block = _require.Block,
    BLOCKS = _require.BLOCKS;

var reBlock = require('../re/block');

/**
 * Serialize an HR to markdown
 * @type {Serializer}
 */
var serialize = Serializer().matchType(BLOCKS.HR).then(function (state) {
    var depth = state.depth,
        text = state.text;


    var isFirstNode = depth == 2 && !text;

    return state.shift().write((isFirstNode ? '\n' : '') + '---\n\n');
});

/**
 * Deserialize an HR to a node.
 * @type {Deserializer}
 */
var deserialize = Deserializer().matchRegExp(reBlock.hr, function (state, match) {
    var node = Block.create({
        type: BLOCKS.HR,
        isVoid: true
    });

    return state.push(node);
});

module.exports = { serialize: serialize, deserialize: deserialize };