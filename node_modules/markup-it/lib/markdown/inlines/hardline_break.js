'use strict';

var _require = require('../../'),
    Serializer = _require.Serializer,
    Deserializer = _require.Deserializer;

var reInline = require('../re/inline');

/**
 * Replace hardline break by two spaces followed by a newline
 *
 * @type {Serializer}
 */
var serialize = Serializer().transformText(function (state, leaf) {
    var text = leaf.text;

    var allowHardlineBreak = state.getProp('hardlineBreak');
    var replaceWith = allowHardlineBreak ? '  \n' : ' ';

    return leaf.merge({
        text: text.replace(/\n/g, replaceWith)
    });
});

/**
 * Deserialize hardline break.
 * http://spec.commonmark.org/0.26/#hard-line-break
 *
 * @type {Deserializer}
 */
var deserialize = Deserializer().matchRegExp(reInline.br, function (state, match) {
    return state.pushText('\n');
});

module.exports = { serialize: serialize, deserialize: deserialize };