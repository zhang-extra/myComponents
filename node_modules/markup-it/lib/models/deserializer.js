'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _require = require('immutable'),
    List = _require.List;

var RuleFunction = require('./rule-function');

var Deserializer = function (_RuleFunction) {
    _inherits(Deserializer, _RuleFunction);

    function Deserializer() {
        _classCallCheck(this, Deserializer);

        return _possibleConstructorReturn(this, (Deserializer.__proto__ || Object.getPrototypeOf(Deserializer)).apply(this, arguments));
    }

    _createClass(Deserializer, [{
        key: 'matchRegExp',


        /**
         * Match text using a regexp, and move the state to the right position.
         *
         * @param {RegExp | Array<RegExp>} re
         * @param {Function} callback
         * @return {Deserializer}
         */
        value: function matchRegExp(res, callback) {
            if (!(res instanceof Array)) {
                res = [res];
            }
            res = List(res);

            var match = void 0;
            return this.filter(function (state) {
                return res.some(function (re) {
                    match = re.exec(state.text);
                    return match;
                });
            }).then(function (state) {
                state = state.skip(match[0].length);
                return callback(state, match);
            });
        }
    }]);

    return Deserializer;
}(RuleFunction);

module.exports = function () {
    return new Deserializer();
};