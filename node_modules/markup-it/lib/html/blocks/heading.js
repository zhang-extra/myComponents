'use strict';

var _RULES;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _require = require('../../'),
    Serializer = _require.Serializer,
    BLOCKS = _require.BLOCKS;

var serializeTag = require('../serializeTag');

var RULES = (_RULES = {}, _defineProperty(_RULES, BLOCKS.HEADING_1, serializeTag('h1', { getAttrs: getAttrs })), _defineProperty(_RULES, BLOCKS.HEADING_2, serializeTag('h2', { getAttrs: getAttrs })), _defineProperty(_RULES, BLOCKS.HEADING_3, serializeTag('h3', { getAttrs: getAttrs })), _defineProperty(_RULES, BLOCKS.HEADING_4, serializeTag('h4', { getAttrs: getAttrs })), _defineProperty(_RULES, BLOCKS.HEADING_5, serializeTag('h5', { getAttrs: getAttrs })), _defineProperty(_RULES, BLOCKS.HEADING_6, serializeTag('h6', { getAttrs: getAttrs })), _RULES);

/**
 * Serialize a heading to HTML
 * @type {Serializer}
 */
var serialize = Serializer().matchType(Object.keys(RULES)).then(function (state) {
    var node = state.peek();
    return RULES[node.type](state);
});

/**
 * @param {Node} headingNode
 * @return {Object} The attributes names/value for the heading
 */
function getAttrs(headingNode) {
    return {
        id: headingNode.data.get('id')
    };
}

module.exports = { serialize: serialize };