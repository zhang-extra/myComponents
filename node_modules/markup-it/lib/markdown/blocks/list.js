'use strict';

var trimTrailingLines = require('trim-trailing-lines');
var indentString = require('indent-string');

var _require = require('../../'),
    Serializer = _require.Serializer,
    Deserializer = _require.Deserializer,
    Block = _require.Block,
    BLOCKS = _require.BLOCKS;

var reList = require('../re/block').list;

/**
 * Serialize a list to markdown
 * @type {Serializer}
 */
var serialize = Serializer().matchType([BLOCKS.UL_LIST, BLOCKS.OL_LIST]).then(function (state) {
    var list = state.peek();
    var nodes = list.nodes;


    var output = nodes.map(function (item, index) {
        return serializeListItem(state, list, item, index);
    }).join('');

    return state.shift().write(output);
});

/**
 * Deserialize a list to a node.
 * @type {Deserializer}
 */
var deserialize = Deserializer().matchRegExp(reList.block, function (state, match) {
    var rawList = match[0];
    var bull = match[2];
    var ordered = bull.length > 1;

    var type = ordered ? BLOCKS.OL_LIST : BLOCKS.UL_LIST;

    var item = void 0,
        loose = void 0,
        data = void 0,
        next = false;

    var lastIndex = 0;
    var nodes = [];
    var rawItem = void 0,
        textItem = void 0,
        space = void 0;
    var items = [];

    // Extract all items
    reList.item.lastIndex = 0;
    while ((item = reList.item.exec(rawList)) !== null) {
        rawItem = rawList.slice(lastIndex, reList.item.lastIndex);
        lastIndex = reList.item.lastIndex;

        items.push([item, rawItem]);
    }

    for (var i = 0; i < items.length; i++) {
        item = items[i][0];
        rawItem = items[i][1];
        data = undefined;

        // Remove the list item's bullet
        // so it is seen as the next token.
        textItem = item[0];
        space = textItem.length;
        textItem = textItem.replace(reList.bulletAndSpaces, '');

        // Parse tasklists
        var checked = reList.checkbox.exec(textItem);
        if (checked) {
            checked = checked[1] === 'x';
            textItem = textItem.replace(reList.checkbox, '');
            data = { checked: checked };
        }

        // Outdent whatever the
        // list item contains. Hacky.
        if (~textItem.indexOf('\n ')) {
            space -= textItem.length;
            textItem = textItem.replace(new RegExp('^ {1,' + space + '}', 'gm'), '');
        }

        // Determine whether item is loose or not.
        // Use: /(^|\n)(?! )[^\n]+\n\n(?!\s*$)/
        // for discount behavior.
        loose = next || /\n\n(?!\s*$)/.test(textItem);
        if (i !== items.length - 1) {
            next = textItem.charAt(textItem.length - 1) === '\n';
            if (!loose) loose = next;
        }

        var nodeItem = Block.create({
            type: BLOCKS.LIST_ITEM,
            data: data,
            nodes: (loose ? state.setProp('looseList', state.depth) : state).use('block').deserialize(textItem)
        });

        nodes.push(nodeItem);
    }

    var listBlock = Block.create({
        type: type,
        nodes: nodes
    });

    return state.push(listBlock);
});

/**
 * Serialize a list item to markdown.
 * @param  {State} state
 * @param  {Block} list
 * @param  {Block} item
 * @param  {Number} index
 * @return {String} output
 */
function serializeListItem(state, list, item, index) {
    // Is it a task item ?
    var hasChecked = item.data.has('checked');
    var isChecked = item.data.get('checked');

    // Is it a loose list?
    var loose = item.nodes.some(function (child) {
        return child.type === BLOCKS.PARAGRAPH;
    });

    // Is it the last item from the list?
    var last = list.nodes.size - 1 === index;

    // Calcul bullet to use
    var bullet = list.type === BLOCKS.OL_LIST ? index + 1 + '.' : '*';

    // Indent all lignes
    var indent = bullet.length + 1;
    var body = state.use('block').serialize(item.nodes);
    // Remove unwanted empty lines added by sub-blocks
    body = trimTrailingLines(body) + '\n';

    body = indentString(body, ' ', indent).slice(indent);

    if (loose || last) {
        // Add empty line
        body += '\n';
    }

    if (hasChecked) {
        body = (isChecked ? '[x]' : '[ ]') + ' ' + body;
    }

    return bullet + ' ' + body;
}

module.exports = { serialize: serialize, deserialize: deserialize };