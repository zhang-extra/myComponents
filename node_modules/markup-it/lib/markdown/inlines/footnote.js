'use strict';

var _require = require('../../'),
    Serializer = _require.Serializer,
    Deserializer = _require.Deserializer,
    Inline = _require.Inline,
    INLINES = _require.INLINES;

var reInline = require('../re/inline');

/**
 * Serialize a footnote to markdown
 * @type {Serializer}
 */
var serialize = Serializer().matchType(INLINES.FOOTNOTE_REF).then(function (state) {
    var node = state.peek();
    var id = node.data.get('id');
    var output = '[^' + id + ']';

    return state.shift().write(output);
});

/**
 * Deserialize a footnote.
 * @type {Deserializer}
 */
var deserialize = Deserializer().matchRegExp(reInline.reffn, function (state, match) {
    var id = match[1];
    var node = Inline.create({
        type: INLINES.FOOTNOTE_REF,
        isVoid: true,
        data: {
            id: id
        }
    });

    return state.push(node);
});

module.exports = { serialize: serialize, deserialize: deserialize };