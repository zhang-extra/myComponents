'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _require = require('../../'),
    Serializer = _require.Serializer,
    Deserializer = _require.Deserializer,
    Inline = _require.Inline,
    INLINES = _require.INLINES;

var reInline = require('../re/inline');
var HTML_BLOCKS = require('./HTML_BLOCKS');

/**
 * Test if a tag name is an HTML block that should not be parsed inside
 * @param {String} tag
 * @return {Boolean}
 */
function isHTMLBlock(tag) {
    tag = tag.toLowerCase();
    return HTML_BLOCKS.indexOf(tag) >= 0;
}

/**
 * Create a raw HTML node (inner Html not parsed)
 * @param {String} openingTag
 * @param {String} closingTag
 * @param {String} innerHtml
 * @param
 * @return {Inline}
 */
function createRawHTML(opts) {
    var _opts$openingTag = opts.openingTag,
        openingTag = _opts$openingTag === undefined ? '' : _opts$openingTag,
        _opts$closingTag = opts.closingTag,
        closingTag = _opts$closingTag === undefined ? '' : _opts$closingTag,
        _opts$innerHtml = opts.innerHtml,
        innerHtml = _opts$innerHtml === undefined ? '' : _opts$innerHtml;

    return Inline.create({
        type: INLINES.HTML,
        isVoid: true,
        data: { openingTag: openingTag, closingTag: closingTag, innerHtml: innerHtml }
    });
}

/**
 * Create an HTML node
 * @param {String} openingTag
 * @param {String} closingTag
 * @param {Node[]} nodes
 * @return {Inline}
 */
function createHTML(opts) {
    var _opts$openingTag2 = opts.openingTag,
        openingTag = _opts$openingTag2 === undefined ? '' : _opts$openingTag2,
        _opts$closingTag2 = opts.closingTag,
        closingTag = _opts$closingTag2 === undefined ? '' : _opts$closingTag2,
        nodes = opts.nodes;

    return Inline.create({
        type: INLINES.HTML,
        data: { openingTag: openingTag, closingTag: closingTag },
        nodes: nodes
    });
}

/**
 * Serialize an HTML node to markdown
 * @type {Serializer}
 */
var serialize = Serializer().matchType(INLINES.HTML).then(function (state) {
    var node = state.peek();

    var _node$data$toObject = node.data.toObject(),
        _node$data$toObject$o = _node$data$toObject.openingTag,
        openingTag = _node$data$toObject$o === undefined ? '' : _node$data$toObject$o,
        _node$data$toObject$c = _node$data$toObject.closingTag,
        closingTag = _node$data$toObject$c === undefined ? '' : _node$data$toObject$c,
        _node$data$toObject$i = _node$data$toObject.innerHtml,
        innerHtml = _node$data$toObject$i === undefined ? '' : _node$data$toObject$i;

    if (innerHtml) {
        return state.shift().write(openingTag).write(innerHtml).write(closingTag);
    } else {
        return state.shift().write(openingTag).write(state.serialize(node.nodes)).write(closingTag);
    }
});

/**
 * Deserialize HTML comment from markdown
 * @type {Deserializer}
 */
var deserializeComment = Deserializer().matchRegExp(reInline.htmlComment, function (state, match) {
    // Ignore
    return state;
});

/**
 * Deserialize HTML tag pair from markdown
 * @type {Deserializer}
 */
var deserializePair = Deserializer().matchRegExp(reInline.htmlTagPair, function (state, match) {
    var _match = _slicedToArray(match, 4),
        fullTag = _match[0],
        tagName = _match[1],
        _match$ = _match[2],
        attributes = _match$ === undefined ? '' : _match$,
        _match$2 = _match[3],
        innerHtml = _match$2 === undefined ? '' : _match$2;

    var openingTag = '<' + tagName + attributes + '>';
    var closingTag = fullTag.slice(openingTag.length + innerHtml.length);

    if (isHTMLBlock(tagName)) {
        // Do not parse inner HTML
        return state.push(createRawHTML({
            openingTag: openingTag,
            closingTag: closingTag,
            innerHtml: innerHtml
        }));
    } else {
        // Parse inner HTML
        var isLink = tagName.toLowerCase() === 'a';

        var innerNodes = state.setProp(isLink ? 'link' : 'html', state.depth).deserialize(innerHtml);

        return state.push(createHTML({
            openingTag: openingTag,
            closingTag: closingTag,
            nodes: innerNodes
        }));
    }
});

/**
 * Deserialize HTML self closing tag from markdown
 * @type {Deserializer}
 */
var deserializeClosing = Deserializer().matchRegExp(reInline.htmlSelfClosingTag, function (state, match) {
    var _match2 = _slicedToArray(match, 1),
        openingTag = _match2[0];

    return state.push(createRawHTML({ openingTag: openingTag }));
});

module.exports = {
    serialize: serialize,
    deserialize: Deserializer().use([deserializeComment, deserializePair, deserializeClosing])
};