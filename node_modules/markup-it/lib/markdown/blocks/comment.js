'use strict';

var _require = require('../../'),
    Serializer = _require.Serializer,
    Deserializer = _require.Deserializer,
    Block = _require.Block,
    BLOCKS = _require.BLOCKS;

var reBlock = require('../re/block');

/**
 * Serialize a comment to markdown
 * @type {Serializer}
 */
var serialize = Serializer().matchType(BLOCKS.COMMENT).then(function (state) {
    var node = state.peek();
    var data = node.data;

    var text = data.get('text');

    return state.shift().write('{# ' + text + ' #}');
});

/**
 * Deserialize a comment to a node.
 * @type {Deserializer}
 */
var deserialize = Deserializer().matchRegExp(reBlock.comment, function (state, match) {
    if (state.getProp('template') === false) {
        return;
    }

    var node = Block.create({
        type: BLOCKS.COMMENT,
        isVoid: true,
        data: {
            text: match[1].trim()
        }
    });

    return state.push(node);
});

module.exports = { serialize: serialize, deserialize: deserialize };