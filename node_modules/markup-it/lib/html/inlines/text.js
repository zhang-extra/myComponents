'use strict';

var _require = require('../../'),
    Serializer = _require.Serializer;

/**
 * Serialize a text node to HTML
 * @type {Serializer}
 */


var serialize = Serializer().matchObject('text').then(function (state) {
    var node = state.peek();
    var text = node.text;

    // Hard-line breaks are newline in text nodes

    text = text.replace(/(?:\r\n|\r|\n)/g, '<br />');

    return state.shift().write(text);
});

module.exports = { serialize: serialize };