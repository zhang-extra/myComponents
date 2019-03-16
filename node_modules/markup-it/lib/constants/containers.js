'use strict';

var _module$exports;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var objectValues = require('object-values');
var BLOCKS = require('./blocks');
var ALL_BLOCKS = objectValues(BLOCKS);

/**
 * Dictionary of all container block types, and the set block types they accept as children.
 * The first value of each set is the default block type.
 *
 * @type {Map<String:Array>}
 */

module.exports = (_module$exports = {
    // We use Document.object instead of its type
    'document': [BLOCKS.PARAGRAPH].concat(_toConsumableArray(ALL_BLOCKS))
}, _defineProperty(_module$exports, BLOCKS.BLOCKQUOTE, [BLOCKS.TEXT].concat(_toConsumableArray(ALL_BLOCKS))), _defineProperty(_module$exports, BLOCKS.TABLE, [BLOCKS.TABLE_ROW]), _defineProperty(_module$exports, BLOCKS.TABLE_ROW, [BLOCKS.TABLE_CELL]), _defineProperty(_module$exports, BLOCKS.LIST_ITEM, [BLOCKS.TEXT].concat(_toConsumableArray(ALL_BLOCKS))), _defineProperty(_module$exports, BLOCKS.OL_LIST, [BLOCKS.LIST_ITEM]), _defineProperty(_module$exports, BLOCKS.UL_LIST, [BLOCKS.LIST_ITEM]), _defineProperty(_module$exports, BLOCKS.CODE, [BLOCKS.CODE_LINE]), _module$exports);