'use strict';

var _module$exports;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var BLOCKS = require('./blocks');

/**
 * Dictionary of all leaf containers (those that can contain inlines or text).

 * @type {Map<String:Boolean>}
 */

module.exports = (_module$exports = {}, _defineProperty(_module$exports, BLOCKS.PARAGRAPH, true), _defineProperty(_module$exports, BLOCKS.TEXT, true), _defineProperty(_module$exports, BLOCKS.TABLE_CELL, true), _defineProperty(_module$exports, BLOCKS.CODE_LINE, true), _module$exports);