'use strict';

var splitLines = require('split-lines');

var _require = require('slate'),
    Block = _require.Block,
    Text = _require.Text;

var BLOCKS = require('../constants/blocks');

/**
 * Deserialize the inner text of a code block
 * @param  {String} text
 * @return {Array<Node>} nodes
 */
function deserializeCodeLines(text) {
    var lines = splitLines(text);

    return lines.map(function (line) {
        return Block.create({
            type: BLOCKS.CODE_LINE,
            nodes: [Text.create(line)]
        });
    });
}

module.exports = deserializeCodeLines;