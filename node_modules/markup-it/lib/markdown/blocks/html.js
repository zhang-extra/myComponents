'use strict';

var _require = require('../../'),
    Serializer = _require.Serializer,
    Deserializer = _require.Deserializer,
    Block = _require.Block,
    BLOCKS = _require.BLOCKS;

var reBlock = require('../re/block');

/**
 * Serialize an HTML block to markdown
 * @type {Serializer}
 */
var serialize = Serializer().matchType(BLOCKS.HTML).then(function (state) {
    var node = state.peek();
    var data = node.data;


    return state.shift().write(data.get('html').trim() + '\n\n');
});

/**
 * Deserialize an HTML block to a node.
 * @type {Deserializer}
 */
var deserialize = Deserializer().matchRegExp(reBlock.html, function (state, match) {
    var node = Block.create({
        type: BLOCKS.HTML,
        isVoid: true,
        data: {
            html: match[0].trim()
        }
    });

    return state.push(node);
});

module.exports = { serialize: serialize, deserialize: deserialize };