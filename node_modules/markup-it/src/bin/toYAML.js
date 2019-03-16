#! /usr/bin/env node
/* eslint-disable no-console */

const yaml = require('js-yaml');
const { Value } = require('slate');
const { transform } = require('./helper');

transform(document => {
    const state = Value.create({ document });
    const raw = state.toJSON();

    console.log(yaml.safeDump(raw));
});
