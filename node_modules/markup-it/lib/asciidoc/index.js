'use strict';

var document = require('./document');

var heading = require('./blocks/heading');
var paragraph = require('./blocks/paragraph');
var unstyled = require('./blocks/unstyled');
var hr = require('./blocks/hr');
var codeBlock = require('./blocks/code');
var blockquote = require('./blocks/blockquote');
var list = require('./blocks/list');
var table = require('./blocks/table');
var footnotes = require('./blocks/footnotes');

var link = require('./inlines/link');
var image = require('./inlines/image');
var text = require('./inlines/text');
var escape = require('./inlines/escape');
var bold = require('./inlines/bold');
var italic = require('./inlines/italic');
var footnoteRef = require('./inlines/footnote');
var strikethrough = require('./inlines/strikethrough');
var code = require('./inlines/code');

module.exports = {
    document: [document],
    block: [footnotes, heading, paragraph, hr, codeBlock, blockquote, unstyled, list, table],
    inline: [link, image, escape, bold, italic, code, strikethrough, footnoteRef, text]
};