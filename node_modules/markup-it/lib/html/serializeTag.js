'use strict';

var is = require('is');

var _require = require('immutable'),
    Map = _require.Map;

/**
 * @param {String} tag The HTML tag
 * @param {Boolean} [opts.isSingleTag=false] Render as self-closing tag
 * @param {Function} [opts.getAttrs] Function to get the HTML
 * attributes of the tag, as an Object
 * @return {Function} A function to seralize a node into an HTML tag
 */


function serializeTag(tag) {
    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var _opts$isSingleTag = opts.isSingleTag,
        isSingleTag = _opts$isSingleTag === undefined ? false : _opts$isSingleTag,
        _opts$getAttrs = opts.getAttrs,
        getAttrs = _opts$getAttrs === undefined ? function (node) {} : _opts$getAttrs;


    return function (state) {
        var node = state.peek();
        var attrs = getAttrs(node);

        var attrsText = attrsToString(attrs);

        var text = void 0;
        if (isSingleTag) {
            text = '<' + tag + attrsText + '/>';
        } else {
            var inner = state.serialize(node.nodes);
            text = '<' + tag + attrsText + '>' + inner + '</' + tag + '>';
        }

        return state.shift().write(text);
    };
}

/**
 * Convert a map of attributes into a string of HTML attributes.
 * @param {Object} attrs
 * @return {String}
 */
function attrsToString(attrs) {
    attrs = new Map(attrs);

    return attrs.reduce(function (output, value, key) {
        if (is.undef(value) || is.nil(value)) {
            return output;
        } else if (is.equal(value, '')) {
            return output + (' ' + key);
        } else {
            return output + (' ' + key + '=' + JSON.stringify(value));
        }
    }, '');
}

module.exports = serializeTag;