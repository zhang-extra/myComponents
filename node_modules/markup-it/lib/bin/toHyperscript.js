#! /usr/bin/env node
'use strict';

/* eslint-disable no-console */

var _require = require('slate'),
    Value = _require.Value;

var hyperprint = require('slate-hyperprint').default;

var _require2 = require('./helper'),
    transform = _require2.transform;

transform(function (document) {
    var state = Value.create({ document: document });
    console.log(hyperprint(state));
});