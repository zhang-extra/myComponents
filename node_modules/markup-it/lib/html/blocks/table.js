'use strict';

var _require = require('../../'),
    Serializer = _require.Serializer,
    BLOCKS = _require.BLOCKS;

// Key to store the current table align in the state


var ALIGN = 'current_table_align';

// Key to indicate that the current row is a header
var THEAD = 'next_row_is_header';

// Key to indicate the current column index
var COL = 'current_column';

/**
 * Serialize a table to HTML
 * @type {Serializer}
 */
var table = {
    serialize: Serializer().matchType(BLOCKS.TABLE).then(function (state) {
        var tableNode = state.peek();
        var align = tableNode.data.get('align');
        var rows = tableNode.nodes;

        var headerText = state.setProp(ALIGN, align).setProp(COL, 0).setProp(THEAD, true).serialize(rows.slice(0, 1));

        var bodyText = state.setProp(ALIGN, align).setProp(COL, 0).serialize(rows.rest());

        return state.shift().write(['<table>', '<thead>', headerText + '</thead>', '<tbody>', bodyText + '</tbody>', '</table>', '\n'].join('\n'));
    })
};

/**
 * Serialize a row to HTML
 * @type {Serializer}
 */
var row = {
    serialize: Serializer().matchType(BLOCKS.TABLE_ROW).then(function (state) {
        var node = state.peek();
        var inner = state.setProp(COL, 0).serialize(node.nodes);

        return state.shift().write('<tr>\n' + inner + '</tr>\n');
    })
};

/**
 * Serialize a table cell to HTML
 * @type {Serializer}
 */
var cell = {
    serialize: Serializer().matchType(BLOCKS.TABLE_CELL).then(function (state) {
        var node = state.peek();
        var isHead = state.getProp(THEAD);
        var align = state.getProp(ALIGN);
        var column = state.getProp(COL);
        var cellAlign = align[column];

        var inner = state.serialize(node.nodes);

        var tag = isHead ? 'th' : 'td';
        var style = cellAlign ? ' style="text-align:' + cellAlign + '"' : '';

        return state.shift().setProp(COL, column + 1).write('<' + tag + style + '>' + inner + '</' + tag + '>\n');
    })
};

module.exports = {
    table: table,
    row: row,
    cell: cell
};