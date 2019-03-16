'use strict';

/* eslint-disable no-unexpected-multiline, no-spaced-func*/
var _require = require('../utils'),
    replace = _require.replace;

// quote related


var singleQuoted = /'(?:[^'\\]|\\.)*'/;
var doubleQuoted = /"(?:[^"\\]|\\.)*"/;
var quoted = replace(/singleQuoted|doubleQuoted/)('singleQuoted', singleQuoted)('doubleQuoted', doubleQuoted)();

// basic types
var integer = /-?\d+/;
var number = /-?\d+\.?\d*|\.?\d+/;
var bool = /true|false/;

// property access
var identifier = /[\w-]+/;
var literal = replace(/(?:quoted|bool|number)/)('quoted', quoted)('bool', bool)('number', number)();

// Match inner of the tag to split the name and the props
var tagLine = replace(/^\s*(identifier)\s*(.*)\s*$/)('identifier', identifier)();

// Types
var numberLine = replace(/^number$/)('number', number)();
var boolLine = replace(/^bool$/i)('bool', bool)();
var quotedLine = replace(/^quoted$/)('quoted', quoted)();

// Assignment of a variable message="Hello"
var assignment = replace(/(identifier)\s*=\s*(literal)/)('identifier', identifier)('literal', literal)();

// Argument or kwargs
var delimiter = /(?:\s*|^)/;
var prop = replace(/(?:delimiter)(?:(assignment|literal))/)('literal', literal)('delimiter', delimiter)('assignment', assignment)();

module.exports = {
    prop: prop,
    quoted: quoted, number: number, bool: bool, literal: literal, integer: integer,
    identifier: identifier,
    quotedLine: quotedLine,
    numberLine: numberLine,
    boolLine: boolLine,
    tagLine: tagLine
};