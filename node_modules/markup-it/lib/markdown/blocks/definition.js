'use strict';

var _require = require('immutable'),
    Map = _require.Map;

var _require2 = require('../../'),
    Deserializer = _require2.Deserializer;

var reDef = /^ {0,3}\[(.+)]:[ \t]*\n?[ \t]*<?(\S+?)>?(?: =([*\d]+[A-Za-z%]{0,4})x([*\d]+[A-Za-z%]{0,4}))?[ \t]*\n?[ \t]*(?:(\n*)["|'(](.+?)["|')][ \t]*)?(?:\n+|(?=~0))/gm;

/**
 * Cleanup a text before parsing: normalize newlines and tabs
 *
 * @param {String} src
 * @return {String}
 */
function cleanupText(src) {
    return src.replace(/\r\n|\r/g, '\n').replace(/\t/g, '    ').replace(/\u00a0/g, ' ').replace(/\u2424/g, '\n').replace(/^ +$/gm, '');
}

/**
 * Deserialize all definitions in a markdown document and store them as
 * "refs" prop.
 * @type {Deserializer}
 */
var deserialize = Deserializer().then(function (state) {
    var text = state.text,
        depth = state.depth,
        nodes = state.nodes;

    // Apply it as first rule only

    if (depth > 2 || nodes.size > 0 || state.getProp('refs')) {
        return;
    }

    // Normalize the text
    text = cleanupText(text);

    var refs = {};

    // Parse all definitions
    text = text.replace(reDef, function (wholeMatch, linkId, href, width, height, blankLines, title) {
        linkId = linkId.toLowerCase();
        refs[linkId] = {
            href: href,
            title: title
        };

        return '';
    });

    return state.replaceText(text).setProp('refs', Map(refs));
});

module.exports = { deserialize: deserialize };