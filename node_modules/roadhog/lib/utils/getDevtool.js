'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getDevtool;

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getDevtool(devtool) {
  // https://github.com/webpack-contrib/uglifyjs-webpack-plugin
  // cheap-source-map options don't work with this plugin
  if (devtool === 'cheap-source-map') {
    console.log(_chalk2.default.yellow('⚠️ cheap-source-map options don\'t work with uglifyjs-webpack-plugin, now cheap-module-source-map is set.'));
    return 'cheap-module-source-map';
  }

  if (devtool.indexOf('eval') >= 0) {
    return false;
  } else {
    return devtool;
  }
}
module.exports = exports['default'];