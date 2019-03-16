'use strict';

var trimRight = require('trim-right');

var _require = require('../../'),
    Serializer = _require.Serializer,
    BLOCKS = _require.BLOCKS;

/**
 * Serialize a table cell node to asciidoc.
 * @type {Serializer}
 */


var serializeCell = Serializer().matchType(BLOCKS.TABLE_CELL).then(function (state) {
    var node = state.peek();
    var inner = state.use('inline').serialize(node.nodes);

    return state.shift().write('|' + inner + ' ');
});

/**
 * Serialize a table row node to asciidoc.
 * @type {Serializer}
 */
var serializeRow = Serializer().matchType(BLOCKS.TABLE_ROW).then(function (state) {
    var node = state.peek();
    var inner = state.use('block').serialize(node.nodes);

    return state.shift().write(trimRight(inner) + '\n');
});

/**
 * Serialize a table node to asciidoc.
 * @type {Serializer}
 */
var serializeTable = Serializer().matchType(BLOCKS.TABLE).then(function (state) {
    var node = state.peek();
    var inner = state.use('block').serialize(node.nodes);

    return state.shift().write('[cols=",",options="header",]\n|======\n' + trimRight(inner) + '\n|======');
});

var serialize = Serializer().use([serializeTable, serializeRow, serializeCell]);

module.exports = { serialize: serialize };