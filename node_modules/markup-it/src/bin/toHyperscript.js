#! /usr/bin/env node
/* eslint-disable no-console */

const { Value } = require('slate');
const hyperprint = require('slate-hyperprint').default;
const { transform } = require('./helper');

transform(document => {
    const state = Value.create({ document });
    console.log(hyperprint(state));
});
