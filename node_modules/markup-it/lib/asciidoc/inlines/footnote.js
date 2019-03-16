'use strict';

var _require = require('immutable'),
    Map = _require.Map;

var _require2 = require('../../'),
    Serializer = _require2.Serializer,
    INLINES = _require2.INLINES;

/**
 * Serialize a footnote to asciidoc
 * @type {Serializer}
 */


var serialize = Serializer().matchType(INLINES.FOOTNOTE_REF).then(function (state) {
    var footnotes = state.getProp('footnotes') || Map();
    var node = state.peek();
    var id = node.data.get('id');

    var inner = footnotes.get(id);

    if (!inner) {
        return state.shift();
    }

    return state.shift().write('footnote:[' + inner + ']');
});

module.exports = { serialize: serialize };