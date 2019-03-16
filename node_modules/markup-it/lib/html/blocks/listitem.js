'use strict';

var _require = require('../../'),
    Serializer = _require.Serializer,
    BLOCKS = _require.BLOCKS;

/**
 * Serialize a list item to HTML
 * @type {Serializer}
 */


var serialize = Serializer().matchType(BLOCKS.LIST_ITEM).then(function (state) {
    var node = state.peek();
    var inner = state.serialize(node.nodes);
    var className = '';

    var isTaskList = node.data.has('checked');
    var isChecked = node.data.get('checked');

    if (isTaskList) {
        className = ' class="task-list-item"';
        inner = '<input type="checkbox" class="task-list-item-checkbox"' + (isChecked ? ' checked' : '') + ' disabled /> ' + inner;
    }

    return state.shift().write('<li' + className + '>' + inner + '</li>\n');
});

module.exports = { serialize: serialize };