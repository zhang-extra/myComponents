'use strict';

var ltrim = require('ltrim');
var rtrim = require('rtrim');

var _require = require('../../'),
    Serializer = _require.Serializer,
    Deserializer = _require.Deserializer,
    Inline = _require.Inline,
    INLINES = _require.INLINES;

var reInline = require('../re/inline');

/**
 * Return true if a tex content is inline
 */
function isInlineTex(content) {
    return content[0] !== '\n';
}

/**
 * Normalize some TeX content
 * @param {String} content
 * @param {Boolean} isInline
 * @return {String}
 */
function normalizeTeX(content, isInline) {
    content = ltrim(content, '\n');
    content = rtrim(content, '\n');

    if (!isInline) {
        content = '\n' + content + '\n';
    }

    return content;
}

/**
 * Serialize a math node to markdown
 * @type {Serializer}
 */
var serialize = Serializer().matchType(INLINES.MATH).then(function (state) {
    var node = state.peek();
    var data = node.data;

    var tex = data.get('tex');
    var isInline = isInlineTex(tex);

    tex = normalizeTeX(tex, isInline);

    var output = '$$' + tex + '$$';

    if (!isInline) {
        output = '\n' + output + '\n';
    }

    return state.shift().write(output);
});

/**
 * Deserialize a math
 * @type {Deserializer}
 */
var deserialize = Deserializer().matchRegExp(reInline.math, function (state, match) {
    var tex = match[1];

    if (state.getProp('math') === false || tex.trim().length === 0) {
        return;
    }

    var node = Inline.create({
        type: INLINES.MATH,
        isVoid: true,
        data: {
            tex: tex
        }
    });

    return state.push(node);
});

module.exports = { serialize: serialize, deserialize: deserialize };