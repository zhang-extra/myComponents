'use strict';

var _require = require('../../'),
    Serializer = _require.Serializer,
    Deserializer = _require.Deserializer,
    Block = _require.Block,
    BLOCKS = _require.BLOCKS;

var reHeading = require('../re/heading');

var TYPES = [BLOCKS.HEADING_1, BLOCKS.HEADING_2, BLOCKS.HEADING_3, BLOCKS.HEADING_4, BLOCKS.HEADING_5, BLOCKS.HEADING_6];

/**
 * Serialize an heading node to markdown
 * @type {Serializer}
 */
var serialize = Serializer().matchType(TYPES).then(function (state) {
    var node = state.peek();
    var type = node.type,
        data = node.data;

    var id = data.get('id');
    var depth = TYPES.indexOf(type);
    var prefix = Array(depth + 2).join('#');

    var inner = state.use('inline').serialize(node.nodes);
    if (id) {
        inner = inner + ' {#' + id + '}';
    }

    return state.shift().write(prefix + ' ' + inner + '\n\n');
});

/**
 * Deserialize a normal heading (starting with "#..") and headings using
 * line syntax to a node.
 * @type {Deserializer}
 */
var deserializeNormal = Deserializer().matchRegExp(reHeading.normal, function (state, match) {
    var level = match[1].length;
    return parseHeadingText(state, level, match[2]);
});

/**
 * Deserialize a line heading.
 * @type {Deserializer}
 */
var deserializeLine = Deserializer().matchRegExp(reHeading.line, function (state, match) {
    var level = match[2] === '=' ? 1 : 2;
    return parseHeadingText(state, level, match[1]);
});

var deserialize = Deserializer().use([deserializeNormal, deserializeLine]);

/**
 * Parse inner text of header to extract ID entity
 * @param  {State} state
 * @param  {Number} level
 * @param  {String} text
 * @return {State}
 */
function parseHeadingText(state, level, text) {
    reHeading.id.lastIndex = 0;
    var match = reHeading.id.exec(text);
    var data = void 0;

    var id = match ? match[2] : null;
    if (id) {
        // Remove ID from text
        text = text.replace(match[0], '').trim();
        data = { id: id };
    } else {
        text = text.trim();
    }

    var node = Block.create({
        type: TYPES[level - 1],
        nodes: state.use('inline').deserialize(text),
        data: data
    });

    return state.push(node);
}

module.exports = { serialize: serialize, deserialize: deserialize };