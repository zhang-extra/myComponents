'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var blocks = require('./blocks');
var inlines = require('./inlines');
var document = require('./document');
var serializeDefault = require('./serializeDefault');

var ALL = [].concat(_toConsumableArray(blocks), _toConsumableArray(inlines), [serializeDefault // Default catch-all rule
]);

// We don't use groups of rules such as 'block' and 'inline' for
// deserialization, because we have a single deserialization rule 'document'.
//
// For serialization, there is no has no ambiguity in the Slate
// format, so we always use all the rules at the same time.
module.exports = {
    document: [document],
    block: ALL
};