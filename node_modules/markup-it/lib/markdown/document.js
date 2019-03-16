'use strict';

var yaml = require('js-yaml');
var fm = require('front-matter');
var Immutable = require('immutable');

var _require = require('../'),
    Serializer = _require.Serializer,
    Deserializer = _require.Deserializer,
    Document = _require.Document;

/**
 * Serialize a document to markdown.
 * @type {Serializer}
 */


var serialize = Serializer().matchObject('document').then(function (state) {
    var node = state.peek();
    var data = node.data,
        nodes = node.nodes;

    var body = state.use('block').serialize(nodes);

    if (data.size === 0) {
        return state.shift().write(body);
    }

    var frontMatter = '---\n' + yaml.safeDump(data.toJS(), { skipInvalid: true }) + '---\n\n';

    return state.shift().write(frontMatter + body);
});

/**
 * Deserialize a document.
 * @type {Deserializer}
 */
var deserialize = Deserializer().then(function (state) {
    var text = state.text;

    var parsed = fm(text);

    var nodes = state.use('block').deserialize(parsed.body);
    var data = Immutable.fromJS(parsed.attributes);

    var node = Document.create({
        data: data,
        nodes: nodes
    });

    return state.skip(text.length).push(node);
});

module.exports = { serialize: serialize, deserialize: deserialize };