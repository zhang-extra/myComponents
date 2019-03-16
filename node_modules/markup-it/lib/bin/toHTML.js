#! /usr/bin/env node
'use strict';

/* eslint-disable no-console */

var _require = require('./helper'),
    transform = _require.transform;

var _require2 = require('../'),
    State = _require2.State;

var html = require('../html');

transform(function (document) {
    var state = State.create(html);
    var output = state.serializeDocument(document);

    console.log(output);
});