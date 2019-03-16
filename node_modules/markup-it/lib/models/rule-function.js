'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _require = require('immutable'),
    Record = _require.Record;

var DEFAULTS = {
    transform: function transform(state) {
        return state;
    }
};

var RuleFunction = function (_Record) {
    _inherits(RuleFunction, _Record);

    function RuleFunction() {
        _classCallCheck(this, RuleFunction);

        return _possibleConstructorReturn(this, (RuleFunction.__proto__ || Object.getPrototypeOf(RuleFunction)).apply(this, arguments));
    }

    _createClass(RuleFunction, [{
        key: 'compose',


        /**
         * Add a composition to the transform function
         * @param  {Function} composer
         * @return {RuleFunction}
         */
        value: function compose(composer) {
            var transform = this.transform;


            transform = composer(transform);
            return this.merge({ transform: transform });
        }

        /**
         * Push a transformation to the stack of execution.
         * @param  {Function} next
         * @return {RuleFunction}
         */

    }, {
        key: 'then',
        value: function then(next) {
            return this.compose(function (prev) {
                return function (state) {
                    state = prev(state);
                    if (typeof state == 'undefined') {
                        return;
                    }

                    return next(state);
                };
            });
        }

        /**
         * Push an interceptor withut changing the end value.
         * @param  {Function} interceptor
         * @return {RuleFunction}
         */

    }, {
        key: 'tap',
        value: function tap(interceptor) {
            return this.compose(function (prev) {
                return function (state) {
                    state = prev(state);

                    interceptor(state);

                    return state;
                };
            });
        }

        /**
         * Try multiple alternatives
         * @param  {Function} alternatives
         * @return {RuleFunction}
         */

    }, {
        key: 'use',
        value: function use(alternatives) {
            return this.then(function (state) {
                var newState = void 0;

                alternatives.some(function (fn) {
                    newState = RuleFunction.exec(fn, state);
                    return Boolean(newState);
                });

                return newState;
            });
        }

        /**
         * Prevent applying the transform function if <match> is false
         * @param  {Function} match
         * @return {RuleFunction}
         */

    }, {
        key: 'filter',
        value: function filter(match) {
            return this.compose(function (prev) {
                return function (state) {
                    state = prev(state);

                    if (!state || !match(state)) {
                        return;
                    }

                    return state;
                };
            });
        }

        /**
         * Prevent applying the transform function if <match> returns true
         * @param  {Function} match
         * @return {RuleFunction}
         */

    }, {
        key: 'filterNot',
        value: function filterNot(match) {
            return this.filter(function (state) {
                return !RuleFunction.exec(match, state);
            });
        }

        /**
         * Execute the transform function on an input
         * @param  {State} state
         * @param  {Object} value
         * @return {Object}
         */

    }, {
        key: 'exec',
        value: function exec(state, value) {
            return this.transform(state);
        }
    }], [{
        key: 'exec',


        /**
         * Execute a rule function or a function.
         * @param {Function or RuleFunction} fn
         * @param {Mixed} ...args
         * @return {Mixed} result
         */
        value: function exec(fn) {
            for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                args[_key - 1] = arguments[_key];
            }

            return fn instanceof RuleFunction ? fn.exec.apply(fn, args) : fn.apply(undefined, args);
        }
    }]);

    return RuleFunction;
}(Record(DEFAULTS));

module.exports = RuleFunction;