'use strict';

var _require = require('../../'),
    Serializer = _require.Serializer,
    Deserializer = _require.Deserializer,
    Inline = _require.Inline,
    INLINES = _require.INLINES;

var reInline = require('../re/inline');

/**
 * Serialize a template variable to markdown
 * @type {Serializer}
 */
var serialize = Serializer().matchType(INLINES.VARIABLE).then(function (state) {
    var node = state.peek();
    var data = node.data;

    var key = data.get('key');

    return state.shift().write('{{ ' + key + ' }}');
});

/**
 * Deserialize a template variable.
 * @type {Deserializer}
 */
var deserialize = Deserializer().matchRegExp(reInline.variable, function (state, match) {
    if (state.getProp('template') === false) {
        return;
    }

    var node = Inline.create({
        type: INLINES.VARIABLE,
        isVoid: true,
        data: {
            key: match[1]
        }
    });

    return state.push(node);
});

module.exports = { serialize: serialize, deserialize: deserialize };