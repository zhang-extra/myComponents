'use strict';

var _require = require('immutable'),
    Map = _require.Map;

var _require2 = require('../../'),
    Serializer = _require2.Serializer,
    Deserializer = _require2.Deserializer,
    Inline = _require2.Inline,
    Text = _require2.Text,
    INLINES = _require2.INLINES;

var reInline = require('../re/inline');
var utils = require('../utils');

/**
 * Serialize a link to markdown
 * @type {Serializer}
 */
var serialize = Serializer().matchType(INLINES.LINK).then(function (state) {
    var node = state.peek();
    var data = node.data,
        nodes = node.nodes;

    var inner = state.use('inline').serialize(nodes);

    // Escape the href
    var href = utils.escapeURL(data.get('href', ''));

    // Escape the title
    var title = utils.escape(data.get('title', ''));

    if (title) {
        title = title ? ' "' + title + '"' : '';
    }

    var output = '[' + inner + '](' + href + title + ')';

    return state.shift().write(output);
});

/**
 * Deserialize a classic image like:
 *  ![Hello](test.png)
 * @type {Deserializer}
 */
var deserializeNormal = Deserializer().matchRegExp(reInline.link, function (state, match) {
    var inner = match[1];
    var nodes = state.use('inline')
    // Signal to children that we are in a link
    .setProp('link', state.depth).deserialize(inner);

    var data = Map({
        href: utils.unescapeURL(match[2]),
        title: match[3] ? utils.unescape(match[3]) : undefined
    }).filter(Boolean);

    var node = Inline.create({
        type: INLINES.LINK,
        nodes: nodes,
        data: data
    });

    return state.push(node);
});

/**
 * Deserialize an url:
 *  https://www.google.fr
 * @type {Deserializer}
 */
var deserializeUrl = Deserializer().matchRegExp(reInline.url, function (state, match) {
    // Already inside a link?
    if (state.getProp('link')) {
        return;
    }

    var href = utils.unescapeURL(match[1]);

    var node = Inline.create({
        type: INLINES.LINK,
        nodes: [Text.create(href)],
        data: { href: href }
    });

    return state.push(node);
});

/**
 * Deserialize an url with < and >:
 *  <samy@gitbook.com>
 * @type {Deserializer}
 */
var deserializeAutolink = Deserializer().matchRegExp(reInline.autolink, function (state, match) {
    // Already inside a link?
    if (state.getProp('link')) {
        return;
    }

    var text = match[1];
    var href = void 0;

    if (match[2] === '@') {
        href = 'mailto:' + text;
    } else {
        href = text;
    }

    var node = Inline.create({
        type: INLINES.LINK,
        nodes: [Text.create(text)],
        data: { href: href }
    });

    return state.push(node);
});

/**
 * Deserialize a reference link:
 *  nolink: [1]
 * @type {Deserializer}
 */
var deserializeRef = Deserializer().matchRegExp([reInline.reflink, reInline.nolink], function (state, match) {
    // Already inside a link?
    if (state.getProp('link')) {
        return;
    }

    var refID = match[2] || match[1];
    var inner = match[1];
    var data = utils.resolveRef(state, refID);

    if (!data) {
        return;
    }

    var nodes = state.use('inline').setProp('link', state.depth).deserialize(inner);

    var node = Inline.create({
        type: INLINES.LINK,
        nodes: nodes,
        data: data
    });

    return state.push(node);
});

/**
 * Deserialize a reference.
 * @type {Deserializer}
 */
var deserializeReffn = Deserializer().matchRegExp(reInline.reffn, function (state, match) {
    // Already inside a link?
    if (state.getProp('link')) {
        return;
    }

    var refID = match[1];
    var data = utils.resolveRef(state, refID);

    if (!data) {
        return;
    }

    var node = Inline.create({
        type: INLINES.LINK,
        nodes: [Text.createFromString(refID)],
        data: data
    });

    return state.push(node);
});

var deserialize = Deserializer().use([deserializeNormal, deserializeUrl, deserializeAutolink, deserializeReffn, deserializeRef]);

module.exports = { serialize: serialize, deserialize: deserialize };