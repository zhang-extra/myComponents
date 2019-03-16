'use strict';

var _require = require('../../'),
    Serializer = _require.Serializer,
    BLOCKS = _require.BLOCKS;

/**
 * Serialize a footnote block to HTML
 * @type {Serializer}
 */


var serialize = Serializer().matchType(BLOCKS.FOOTNOTE).then(function (state) {
    var node = state.peek();
    var text = state.serialize(node.nodes);
    var refname = node.data.get('id');

    return state.shift().write('<blockquote id="fn_' + refname + '">\n<sup>' + refname + '</sup>. ' + text + '\n<a href="#reffn_' + refname + '" title="Jump back to footnote [' + refname + '] in the text."> &#8617;</a>\n</blockquote>\n');
});

module.exports = { serialize: serialize };