'use strict';

var trimNewlines = require('trim-newlines');

var _require = require('../../'),
    Serializer = _require.Serializer,
    Deserializer = _require.Deserializer,
    Block = _require.Block,
    BLOCKS = _require.BLOCKS;

var deserializeCodeLines = require('../../utils/deserializeCodeLines');
var reBlock = require('../re/block');
var utils = require('../utils');

/**
 * Serialize a code block to markdown
 * @type {Serializer}
 */
var serialize = Serializer().matchType(BLOCKS.CODE).then(function (state) {
    var node = state.peek();
    var nodes = node.nodes,
        data = node.data;

    // Escape the syntax
    // http://spec.commonmark.org/0.15/#example-234

    var syntax = utils.escape(data.get('syntax') || '');

    // Get inner content and number of fences
    var innerText = nodes.map(function (line) {
        return line.text;
    }).join('\n');
    var hasFences = innerText.indexOf('`') >= 0;

    var output = void 0;

    // Use fences if syntax is set
    if (!hasFences || syntax) {
        output = '```' + (Boolean(syntax) ? syntax : '') + '\n' + (innerText + '\n') + ('```' + '\n\n');

        return state.shift().write(output);
    }

    output = nodes.map(function (_ref) {
        var text = _ref.text;

        if (!text.trim()) {
            return '';
        }
        return '    ' + text;
    }).join('\n') + '\n\n';

    return state.shift().write(output);
});

/**
 * Deserialize a code block to a node.
 * @type {Deserializer}
 */
var deserializeFences = Deserializer().matchRegExp(reBlock.fences, function (state, match) {
    // Extract code block text, and trim empty lines
    var text = trimNewlines(match[3]);

    // Extract language syntax
    var data = void 0;
    if (Boolean(match[2])) {
        data = {
            syntax: utils.unescape(match[2].trim())
        };
    }

    // Split lines
    var nodes = deserializeCodeLines(text);

    var node = Block.create({
        type: BLOCKS.CODE,
        nodes: nodes,
        data: data
    });

    return state.push(node);
});

/**
 * Deserialize a code block to a node.
 * @type {Deserializer}
 */
var deserializeTabs = Deserializer().matchRegExp(reBlock.code, function (state, match) {
    var inner = match[0];

    // Remove indentation
    inner = inner.replace(/^( {4}|\t)/gm, '');

    // No pedantic mode
    inner = inner.replace(/\n+$/, '');

    // Split lines
    var nodes = deserializeCodeLines(inner);

    var node = Block.create({
        type: BLOCKS.CODE,
        nodes: nodes
    });

    return state.push(node);
});

var deserialize = Deserializer().use([deserializeFences, deserializeTabs]);

module.exports = { serialize: serialize, deserialize: deserialize };