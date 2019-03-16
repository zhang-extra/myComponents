'use strict';

var _BULLETS;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var trimRight = require('trim-right');

var _require = require('../../'),
    Serializer = _require.Serializer,
    BLOCKS = _require.BLOCKS;

var isList = function isList(node) {
    return node.type === BLOCKS.UL_LIST || node.type === BLOCKS.OL_LIST;
};

var BULLETS = (_BULLETS = {}, _defineProperty(_BULLETS, BLOCKS.UL_LIST, '*'), _defineProperty(_BULLETS, BLOCKS.OL_LIST, '.'), _BULLETS);

/**
 * Serialize a list item to asciidoc.
 * @type {Serializer}
 */
var serializeItem = Serializer().matchType(BLOCKS.LIST_ITEM).then(function (state) {
    var node = state.peek();
    var nodes = node.nodes;


    var listType = state.getProp('listType');
    var listDepth = state.getProp('listDepth');

    var bullet = BULLETS[listType];
    var prefix = Array(listDepth + 1).join(bullet);

    var inner = nodes.reduce(function (text, child, i) {
        if (!isList(child) && i > 0) {
            text += '+\n\n';
        }

        text += state.use('block').serialize([child]);
        return text;
    }, '');

    return state.shift().write(prefix + ' ' + trimRight(inner) + '\n');
});

/**
 * Serialize a list node to asciidoc.
 * @type {Serializer}
 */
var serializeList = Serializer().matchType([BLOCKS.UL_LIST, BLOCKS.OL_LIST]).then(function (state) {
    var node = state.peek();
    var nodes = node.nodes,
        type = node.type;


    var inner = state.use('block').setProp('listType', type).setProp('listDepth', state.getProp('listDepth', 0) + 1).serialize(nodes);

    return state.shift().write(inner + '\n\n');
});

var serialize = Serializer().use([serializeList, serializeItem]);

module.exports = { serialize: serialize };