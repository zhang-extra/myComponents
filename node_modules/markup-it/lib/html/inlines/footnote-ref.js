'use strict';

var _require = require('../../'),
    Serializer = _require.Serializer,
    INLINES = _require.INLINES;

/**
 * Serialize a inline footnote reference to HTML
 * @type {Serializer}
 */


var serialize = Serializer().matchType(INLINES.FOOTNOTE_REF).then(function (state) {
    var node = state.peek();
    var refname = node.data.get('id');
    return state.shift().write('<sup><a href="#fn_' + refname + '" id="reffn_' + refname + '">' + refname + '</a></sup>');
});

module.exports = { serialize: serialize };