'use strict';

/* eslint-disable no-console */
var fs = require('fs');
var path = require('path');

var unendingTags = require('../../test/unendingTags');

var _require = require('../'),
    State = _require.State;

var markdown = require('../markdown');
var html = require('../html');
var asciidoc = require('../asciidoc');

var PARSERS = {
    '.md': markdown,
    '.markdown': markdown,
    '.mdown': markdown,
    '.html': html,
    '.adoc': asciidoc,
    '.asciidoc': asciidoc
};

/**
 * Fail with an error message
 * @param  {String} msg
 */
function fail(msg) {
    console.log('error:', msg);
    process.exit(1);
}

/**
 * Execute a transformation over file
 * @param  {Function} fn [description]
 * @return {[type]}      [description]
 */
function transform(fn) {
    if (process.argv.length < 3) {
        fail('no input file');
    }

    var filePath = path.join(process.cwd(), process.argv[2]);

    var ext = path.extname(filePath);
    var parser = PARSERS[ext];

    if (!parser) {
        fail('no parser for this file type');
    }

    var content = fs.readFileSync(filePath, { encoding: 'utf8' });
    var state = State.create(parser, { unendingTags: unendingTags });

    var document = state.deserializeToDocument(content);

    fn(document, state);
}

module.exports = {
    transform: transform
};