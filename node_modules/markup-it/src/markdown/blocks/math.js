const { Deserializer, Inline, Block, INLINES, BLOCKS } = require('../../');
const reBlock = require('../re/block');

/**
 * Deserialize a math block into a paragraph with an inline math in it.
 * @type {Deserializer}
 */
const deserialize = Deserializer()
    .matchRegExp(reBlock.math, (state, match) => {
        const tex = match[2];

        if (state.getProp('math') === false || tex.trim().length === 0) {
            return;
        }

        const math = Inline.create({
            type: INLINES.MATH,
            isVoid: true,
            data: {
                tex
            }
        });

        const node = Block.create({
            type: BLOCKS.PARAGRAPH,
            nodes: [
                math
            ]
        });

        return state.push(node);
    });


module.exports = { deserialize };
