'use strict';

var block = require('./blocks');
var inline = require('./inlines');
var document = require('./document');

module.exports = {
    document: [document],
    inline: inline,
    block: block
};