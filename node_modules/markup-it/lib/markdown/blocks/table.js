'use strict';

var _require = require('../../'),
    Serializer = _require.Serializer,
    Deserializer = _require.Deserializer,
    Block = _require.Block,
    BLOCKS = _require.BLOCKS,
    TABLE_ALIGN = _require.TABLE_ALIGN;

var reTable = require('../re/table');

/**
 * Deserialize a table with no leading pipe (gfm) to a node.
 * @type {Deserializer}
 */
var deserializeNoPipe = Deserializer().matchRegExp(reTable.nptable, function (state, match) {
    // Get all non empty lines
    var lines = match[0].split('\n').filter(Boolean);
    var header = lines[0];
    var align = lines[1];
    var rows = lines.slice(2);

    var node = parseTable(state, header, align, rows);
    return state.push(node);
});

/**
 * Deserialize a normal table to a node.
 * @type {Deserializer}
 */
var deserializeNormal = Deserializer().matchRegExp(reTable.normal, function (state, match) {
    // Get all non empty lines
    var lines = match[0].split('\n').filter(Boolean);
    var header = lines[0];
    var align = lines[1];
    var rows = lines.slice(2);

    var node = parseTable(state, header, align, rows);
    return state.push(node);
});

/**
 * Serialize a table node to markdown
 * @type {Serializer}
 */
var serialize = Serializer().matchType(BLOCKS.TABLE).then(function (state) {
    var node = state.peek();
    var data = node.data,
        nodes = node.nodes;

    var align = data.get('align');
    var headerRow = nodes.get(0);
    var bodyRows = nodes.slice(1);

    var output = rowToText(state, headerRow) + '\n' + alignToText(align) + '\n' + bodyRows.map(function (row) {
        return rowToText(state, row);
    }).join('\n') + '\n\n';

    return state.shift().write(output);
});

var deserialize = Deserializer().use([deserializeNoPipe, deserializeNormal]);

/**
 * Parse a table into a node.
 * @param  {State} state
 * @param  {String} headerStr
 * @param  {String} alignStr
 * @param  {String} rowStrs
 * @return {Block} table
 */
function parseTable(state, headerStr, alignStr, rowStrs) {
    // Header
    var headerRow = parseRow(state, headerStr);

    // Rows
    var rowTokens = rowStrs.map(function (rowStr) {
        return parseRow(state, rowStr);
    });

    // Align for columns
    var alignCells = rowToCells(alignStr);
    var align = mapAlign(alignCells);

    return Block.create({
        type: BLOCKS.TABLE,
        data: { align: align },
        nodes: [headerRow].concat(rowTokens)
    });
}

/**
 * Parse a row from a table into a row node.
 *
 * @param {State} state
 * @param {String} row
 * @return {Node}
 */
function parseRow(state, row) {
    // Split into cells
    var cells = rowToCells(row);

    // Tokenize each cell
    var cellNodes = cells.map(function (cell) {
        var text = cell.trim();
        var nodes = state.use('inline').deserialize(text); // state.deserializeWith(text, rowRules);

        return Block.create({
            type: BLOCKS.TABLE_CELL,
            nodes: nodes
        });
    });

    return Block.create({
        type: BLOCKS.TABLE_ROW,
        nodes: cellNodes
    });
}

/**
 * Split a row up into its individual cells
 *
 * @param {String} rowStr
 * @return {Array<String>}
 */
function rowToCells(rowStr) {
    var cells = [];
    var trimmed = rowStr.trim();

    var lastSep = 0;
    for (var i = 0; i < trimmed.length; i++) {
        var prevIdx = i === 0 ? 0 : i - 1;
        var isSep = trimmed[i] === '|';
        var isNotEscaped = trimmed[prevIdx] !== '\\';

        if (isSep && isNotEscaped) {
            // New cell
            if (i > 0 && i < trimmed.length) {
                cells.push(trimmed.slice(lastSep, i));
            }
            lastSep = i + 1;
        }
    }
    // Last cell
    if (lastSep < trimmed.length) {
        cells.push(trimmed.slice(lastSep));
    }

    return cells;
}

/**
 * Detect alignement per column
 *
 * @param {Array<String>}
 * @return {Array<String|null>}
 */
function mapAlign(align) {
    return align.map(function (s) {
        if (reTable.alignRight.test(s)) {
            return TABLE_ALIGN.RIGHT;
        } else if (reTable.alignCenter.test(s)) {
            return TABLE_ALIGN.CENTER;
        } else if (reTable.alignLeft.test(s)) {
            return TABLE_ALIGN.LEFT;
        } else {
            return null;
        }
    });
}

/**
 * Render a row to text.
 *
 * @param {State} state
 * @param {Node} row
 * @return {String} text
 */
function rowToText(state, row) {
    var nodes = row.nodes;

    return '| ' + nodes.map(function (cell) {
        return cellToText(state, cell);
    }).join(' | ') + ' |';
}

/**
 * Render a cell to text.
 *
 * @param {State} state
 * @param {Node} row
 * @return {String} text
 */
function cellToText(state, cell) {
    var nodes = cell.nodes;

    return state.use('inline').serialize(nodes);
}

/**
 * Render align of a table to text
 *
 * @param {Array<String>} row
 * @return {String}
 */
function alignToText(row) {
    return '|' + row.map(function (align) {
        if (align == 'right') {
            return ' ---: |';
        } else if (align == 'center') {
            return ' :---: |';
        } else if (align == 'left') {
            return ' :--- |';
        } else {
            return ' --- |';
        }
    }).join('');
}

module.exports = { serialize: serialize, deserialize: deserialize };