#! /usr/bin/env node
'use strict';

/* eslint-disable no-console */

var _require = require('./helper'),
    transform = _require.transform;

transform(function (document, state) {
    var output = state.serializeDocument(document);
    console.log(output);
});