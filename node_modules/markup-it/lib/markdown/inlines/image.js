'use strict';

var _require = require('immutable'),
    Map = _require.Map;

var _require2 = require('../../'),
    Serializer = _require2.Serializer,
    Deserializer = _require2.Deserializer,
    Inline = _require2.Inline,
    INLINES = _require2.INLINES;

var reInline = require('../re/inline');
var utils = require('../utils');

/**
 * Resolve an image reference
 * @param  {State} state
 * @param  {String} refID
 * @return {Map} data?
 */
function resolveImageRef(state, refID) {
    var data = utils.resolveRef(state, refID);

    if (!data) {
        return;
    }

    return data.set('src', data.get('href')).remove('href');
}

/**
 * Test if a link input is an image
 * @param {String} raw
 * @return {Boolean}
 */
function isImage(raw) {
    return raw.charAt(0) === '!';
}

/**
 * Serialize a image to markdown
 * @type {Serializer}
 */
var serialize = Serializer().matchType(INLINES.IMAGE).then(function (state) {
    var node = state.peek();
    var data = node.data;

    // Escape the url

    var src = utils.escapeURL(data.get('src') || '');

    var alt = utils.escape(data.get('alt') || '');
    var title = utils.escape(data.get('title') || '');

    var output = void 0;

    if (title) {
        output = '![' + alt + '](' + src + ' "' + title + '")';
    } else {
        output = '![' + alt + '](' + src + ')';
    }

    return state.shift().write(output);
});

/**
 * Deserialize a classic image like:
 *  ![Hello](test.png)
 * @type {Deserializer}
 */
var deserializeNormal = Deserializer().matchRegExp(reInline.link, function (state, match) {
    if (!isImage(match[0])) {
        return;
    }

    var data = Map({
        alt: match[1] ? utils.unescape(match[1]) : undefined,
        src: utils.unescapeURL(match[2]),
        title: match[3] ? utils.unescape(match[3]) : undefined
    }).filter(Boolean);

    var node = Inline.create({
        type: INLINES.IMAGE,
        isVoid: true,
        data: data
    });

    return state.push(node);
});

/**
 * Deserialize a reference image:
 *  nolink: ![1]
 * @type {Deserializer}
 */
var deserializeRef = Deserializer().matchRegExp([reInline.reflink, reInline.nolink], function (state, match) {
    if (!isImage(match[0])) {
        return;
    }

    var refID = match[2] || match[1];
    var data = resolveImageRef(state, refID);

    if (!data) {
        return;
    }

    var node = Inline.create({
        type: INLINES.IMAGE,
        isVoid: true,
        data: data
    });

    return state.push(node);
});

var deserialize = Deserializer().use([deserializeNormal, deserializeRef]);

module.exports = { serialize: serialize, deserialize: deserialize };