'use strict';

var _require = require('immutable'),
    Map = _require.Map;

var _require2 = require('../../utils/escape'),
    escapeWith = _require2.escapeWith,
    unescapeWith = _require2.unescapeWith;

// Replacements for properties escapement


var REPLACEMENTS = Map([['*', '\\*'], ['#', '\\#'], ['(', '\\('], [')', '\\)'], ['[', '\\['], [']', '\\]'], ['`', '\\`'], ['_', '\\_'], ['|', '\\|'], ['"', '\\"'], ['\'', '\\\'']]);

module.exports = {
    escape: function escape(str) {
        return escapeWith(REPLACEMENTS, str);
    },
    unescape: function unescape(str) {
        return unescapeWith(REPLACEMENTS, str);
    }
};