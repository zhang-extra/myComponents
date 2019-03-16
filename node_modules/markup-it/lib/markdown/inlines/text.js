'use strict';

var _require = require('../../'),
    Serializer = _require.Serializer,
    Deserializer = _require.Deserializer;

var reInline = require('../re/inline');
var utils = require('../utils');

/**
 * Serialize a text node to markdown
 * @type {Serializer}
 */
var serialize = Serializer().matchObject('text').then(function (state) {
    var node = state.peek();

    return state.shift().write(node.text);
});

/**
 * Deserialize escaped text.
 * @type {Deserializer}
 */
var deserializeEscaped = Deserializer().matchRegExp(reInline.escape, function (state, match) {
    return state.pushText(match[1]);
});

/**
 * Deserialize text.
 * @type {Deserializer}
 */
var deserializeText = Deserializer().matchRegExp(reInline.text, function (state, match) {
    var text = utils.unescape(match[0]);
    return state.pushText(text);
});

var deserialize = Deserializer().use([deserializeEscaped, deserializeText]);

module.exports = { serialize: serialize, deserialize: deserialize };