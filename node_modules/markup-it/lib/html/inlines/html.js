'use strict';

var _require = require('../../'),
    Serializer = _require.Serializer,
    INLINES = _require.INLINES;

/**
 * Serialize an HTML inline to HTML
 * @type {Serializer}
 */


var serialize = Serializer().matchType(INLINES.HTML).then(function (state) {
    var node = state.peek();

    var _node$data$toObject = node.data.toObject(),
        html = _node$data$toObject.html,
        openingTag = _node$data$toObject.openingTag,
        closingTag = _node$data$toObject.closingTag,
        innerHtml = _node$data$toObject.innerHtml;

    if (html) {
        // Legacy format
        return state.shift().write(html);
    } else if (innerHtml) {
        return state.shift().write(openingTag).write(innerHtml).write(closingTag);
    } else {
        return state.shift().write(openingTag).write(state.serialize(node.nodes)).write(closingTag);
    }
});

module.exports = { serialize: serialize };