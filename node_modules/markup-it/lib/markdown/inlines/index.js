'use strict';

var text = require('./text');
var footnote = require('./footnote');
var image = require('./image');
var link = require('./link');
var html = require('./html');
var math = require('./math');
var variable = require('./variable');

var escape = require('./escape');
var code = require('./code');
var bold = require('./bold');
var italic = require('./italic');
var hardlineBreak = require('./hardline_break');
var strikethrough = require('./strikethrough');

module.exports = [footnote, image, link, math, html, variable, hardlineBreak,

// Text ranegs should be escaped before processing marks
escape,
// Code mark should be applied before everything else
code,
// Bold should be before italic
bold, italic, strikethrough, text];