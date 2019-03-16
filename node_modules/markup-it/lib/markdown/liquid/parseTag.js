'use strict';

var _require = require('immutable'),
    Map = _require.Map;

var lexical = require('./lexical');

var _require2 = require('./escape'),
    unescape = _require2.unescape;

/**
 * Parse a literal value.
 * @param  {String} str
 * @return {String|Number|Boolean}
 */


function parseLiteral(str) {
    if (str.match(lexical.numberLine)) {
        return Number(str);
    } else if (str.match(lexical.boolLine)) {
        return str.toLowerCase() === 'true';
    } else if (str.match(lexical.quotedLine)) {
        return unescape(str.slice(1, -1));
    }

    return str;
}

/**
 * Parse data of the block.
 * @param  {String} text
 * @return {Map} props
 */
function parseData(text) {
    var match = void 0,
        args = 0;
    var result = {};

    do {
        match = text.match(lexical.prop);

        if (match) {
            if (match[2]) {
                result[match[2]] = parseLiteral(match[3]);
            } else {
                result[args] = parseLiteral(match[1]);
                args++;
            }

            text = text.slice(match[0].length);
        }
    } while (match);

    return Map(result);
}

/**
 * Parse the inner text of a tag.
 * @param  {String} text
 * @return {Object | Null} { tag: String, data: Map }
 */
function parseTag(text) {
    var match = text.match(lexical.tagLine);

    if (!match) {
        return null;
    }

    return {
        tag: match[1],
        data: parseData(match[2])
    };
}

module.exports = parseTag;