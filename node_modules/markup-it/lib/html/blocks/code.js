'use strict';

var _require = require('../../'),
    Serializer = _require.Serializer,
    BLOCKS = _require.BLOCKS;

var escape = require('../escape');

/**
 * Serialize a code block to HTML
 * @type {Serializer}
 */
var serialize = Serializer().matchType(BLOCKS.CODE).then(function (state) {
    var node = state.peek();
    var syntax = node.data.get('syntax');
    var text = node.nodes.map(function (line) {
        return line.text;
    }).join('\n');

    var className = syntax ? ' class="lang-' + syntax + '"' : '';

    return state.shift().write('<pre><code' + className + '>' + escape(text) + '</code></pre>\n');
});

module.exports = { serialize: serialize };