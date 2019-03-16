'use strict';

var _require = require('../../'),
    Serializer = _require.Serializer,
    BLOCKS = _require.BLOCKS;

/**
 * Return true if a list node contains task items.
 * @param {Block} list
 * @return {Boolean}
 */


function containsTaskList(list) {
    var nodes = list.nodes;

    return nodes.some(function (item) {
        return item.data.has('checked');
    });
}

/**
 * Serialize a unordered list to HTML
 * @type {Serializer}
 */
var serialize = Serializer().matchType([BLOCKS.OL_LIST, BLOCKS.UL_LIST]).then(function (state) {
    var node = state.peek();
    var tag = node.type === BLOCKS.OL_LIST ? 'ol' : 'ul';
    var isTaskList = containsTaskList(node);
    var inner = state.serialize(node.nodes);

    return state.shift().write('<' + tag + (isTaskList ? ' class="contains-task-list"' : '') + '>\n' + inner + '</' + tag + '>\n');
});

module.exports = { serialize: serialize };