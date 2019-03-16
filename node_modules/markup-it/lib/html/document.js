'use strict';

var _require = require('../'),
    Serializer = _require.Serializer,
    Deserializer = _require.Deserializer;

var parse = require('./parse');

/**
 * Serialize a document to HTML.
 * @type {Serializer}
 */
var serialize = Serializer().matchObject('document').then(function (state) {
    var node = state.peek();
    var nodes = node.nodes;


    var text = state.use('block').serialize(nodes);

    return state.shift().write(text);
});

/**
 * Deserialize an HTML document.
 * @type {Deserializer}
 */
var deserialize = Deserializer().then(function (state) {
    var text = state.text;

    var document = parse(text);

    return state.skip(text.length).push(document);
});

module.exports = { serialize: serialize, deserialize: deserialize };