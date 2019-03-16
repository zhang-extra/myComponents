'use strict';

var _require = require('../../'),
    Deserializer = _require.Deserializer,
    Inline = _require.Inline,
    Block = _require.Block,
    INLINES = _require.INLINES,
    BLOCKS = _require.BLOCKS;

var reBlock = require('../re/block');

/**
 * Deserialize a math block into a paragraph with an inline math in it.
 * @type {Deserializer}
 */
var deserialize = Deserializer().matchRegExp(reBlock.math, function (state, match) {
    var tex = match[2];

    if (state.getProp('math') === false || tex.trim().length === 0) {
        return;
    }

    var math = Inline.create({
        type: INLINES.MATH,
        isVoid: true,
        data: {
            tex: tex
        }
    });

    var node = Block.create({
        type: BLOCKS.PARAGRAPH,
        nodes: [math]
    });

    return state.push(node);
});

module.exports = { deserialize: deserialize };