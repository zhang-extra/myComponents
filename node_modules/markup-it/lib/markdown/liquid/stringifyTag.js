'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var is = require('is');

var _require = require('./escape'),
    escape = _require.escape;

/**
 * Stringify a literal
 * @param  {Mixed} value
 * @return {String}
 */


function stringifyLiteral(value) {
    if (is.bool(value)) {
        return value ? 'true' : 'false';
    } else if (is.string(value)) {
        return '"' + escape(value) + '"';
    } else {
        return String(value);
    }
}

/**
 * Stringify a map of properties.
 * @param  {Map} data
 * @return {String}
 */
function stringifyData(data) {
    return data.entrySeq().map(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            key = _ref2[0],
            value = _ref2[1];

        var isArgs = Number(key) >= 0;
        value = stringifyLiteral(value);

        if (isArgs) {
            return value;
        }

        return key + '=' + value;
    }).join(' ');
}

/**
 * Stringify a custom liquid tag.
 *
 * @param  {Object} tagData
 *    [tagData.type] {String}
 *    [tagData.data] {Map}
 * @return {String}
 */
function stringifyTag(_ref3) {
    var tag = _ref3.tag,
        data = _ref3.data;

    return '{% ' + tag + (data && data.size > 0 ? ' ' + stringifyData(data) : '') + ' %}';
}

module.exports = stringifyTag;