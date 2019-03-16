'use strict';

var _require = require('../../'),
    Serializer = _require.Serializer,
    MARKS = _require.MARKS;

var utils = require('../utils');

/**
 * Escape all text leaves during serialization.
 * This step should be done before processing text leaves for marks.
 *
 * @type {Serializer}
 */
var serialize = Serializer().transformText(function (state, leaf) {
    var text = leaf.text,
        marks = leaf.marks;

    var hasCode = marks.some(function (mark) {
        return mark.type === MARKS.CODE;
    });

    return leaf.merge({
        text: hasCode ? text : utils.escape(text, false)
    });
});

module.exports = { serialize: serialize };