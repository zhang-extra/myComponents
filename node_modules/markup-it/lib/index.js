'use strict';

var _require = require('slate'),
    Document = _require.Document,
    Block = _require.Block,
    Inline = _require.Inline,
    Text = _require.Text,
    Mark = _require.Mark,
    Leaf = _require.Leaf;

var State = require('./models/state');
var Deserializer = require('./models/deserializer');
var Serializer = require('./models/serializer');

var MARKS = require('./constants/marks');
var BLOCKS = require('./constants/blocks');
var INLINES = require('./constants/inlines');
var VOID = require('./constants/void');
var CONTAINERS = require('./constants/containers');
var LEAFS = require('./constants/leafs');
var TABLE_ALIGN = require('./constants/table-align');

module.exports = {
    State: State,
    Serializer: Serializer,
    Deserializer: Deserializer,
    // Constants
    MARKS: MARKS,
    BLOCKS: BLOCKS,
    INLINES: INLINES,
    TABLE_ALIGN: TABLE_ALIGN,
    CONTAINERS: CONTAINERS,
    LEAFS: LEAFS,
    VOID: VOID,
    // Slate exports
    Document: Document, Block: Block, Inline: Inline, Text: Text, Mark: Mark, Leaf: Leaf
};