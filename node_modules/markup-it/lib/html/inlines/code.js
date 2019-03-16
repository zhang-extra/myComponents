'use strict';

var _require = require('../../'),
    Serializer = _require.Serializer,
    MARKS = _require.MARKS;

var escape = require('../escape');

/**
 * Serialize an inline code to HTML
 * @type {Serializer}
 */
var serialize = Serializer().transformMarkedLeaf(MARKS.CODE, function (state, text, mark) {
    return '<code>' + escape(text) + '</code>';
});

module.exports = { serialize: serialize };