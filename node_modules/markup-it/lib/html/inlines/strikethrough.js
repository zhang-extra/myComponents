'use strict';

var _require = require('../../'),
    Serializer = _require.Serializer,
    MARKS = _require.MARKS;

/**
 * Serialize a strikethrough text to HTML
 * @type {Serializer}
 */


var serialize = Serializer().transformMarkedLeaf(MARKS.STRIKETHROUGH, function (state, text, mark) {
    return '<del>' + text + '</del>';
});

module.exports = { serialize: serialize };