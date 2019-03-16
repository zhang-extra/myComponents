'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var typeOf = require('type-of');
var uid = require('uid');

var _require = require('slate'),
    Text = _require.Text,
    Mark = _require.Mark;

var RuleFunction = require('./rule-function');

var Serializer = function (_RuleFunction) {
    _inherits(Serializer, _RuleFunction);

    function Serializer() {
        _classCallCheck(this, Serializer);

        return _possibleConstructorReturn(this, (Serializer.__proto__ || Object.getPrototypeOf(Serializer)).apply(this, arguments));
    }

    _createClass(Serializer, [{
        key: 'matchType',


        /**
         * Limit execution of the serializer to a set of node types
         * @param {Function || Array || String} matcher
         * @return {Serializer}
         */
        value: function matchType(matcher) {
            matcher = normalizeMatcher(matcher);

            return this.filter(function (state) {
                var node = state.peek();
                var type = node.type;

                return matcher(type);
            });
        }

        /**
         * Limit execution of the serializer to a "object" of node
         * @param {Function || Array || String} matcher
         * @return {Serializer}
         */

    }, {
        key: 'matchObject',
        value: function matchObject(matcher) {
            matcher = normalizeMatcher(matcher);

            return this.filter(function (state) {
                var node = state.peek();
                var object = node.object;

                return matcher(object);
            });
        }

        /**
         * Limit execution of the serializer to leaf containing a certain mark
         * @param {Function || Array || String} matcher
         * @param {Function} transform(State, String, Mark)
         * @return {Serializer}
         */

    }, {
        key: 'matchMark',
        value: function matchMark(matcher) {
            matcher = normalizeMatcher(matcher);

            return this.matchObject('text').filter(function (state) {
                var text = state.peek();

                return text.characters.some(function (char) {
                    var hasMark = char.marks.some(function (mark) {
                        return matcher(mark.type);
                    });
                    return hasMark;
                });
            });
        }

        /**
         * Transform all leaves in a text.
         * @param {Function} transform(state: State, leaf: Leaf)
         * @return {Serializer}
         */

    }, {
        key: 'transformLeaves',
        value: function transformLeaves(transform) {
            return this.matchObject('text').then(function (state) {
                var text = state.peek();
                var leaves = text.getLeaves();

                // Transform leaves
                leaves = leaves.map(function (leaf) {
                    return transform(state, leaf);
                });

                // Create new text and push it back
                var newText = Text.create({ leaves: leaves });
                return state.shift().unshift(newText);
            });
        }

        /**
         * Transform leaves matching a mark
         * @param {Function || Array || String} matcher
         * @param {Function} transform(state: State, text: String, mark: Mark): String
         * @return {Serializer}
         */

    }, {
        key: 'transformMarkedLeaf',
        value: function transformMarkedLeaf(matcher, transform) {
            matcher = normalizeMatcher(matcher);

            return this.matchMark(matcher).transformLeaves(function (state, leaf) {
                var _leaf = leaf,
                    text = _leaf.text,
                    marks = _leaf.marks;

                var mark = leaf.marks.find(function (_ref) {
                    var type = _ref.type;
                    return matcher(type);
                });
                if (!mark) {
                    return leaf;
                }

                text = transform(state, text, mark);
                marks = marks.delete(mark);
                leaf = leaf.merge({ text: text, marks: marks });

                return leaf;
            });
        }

        /**
         * Transform text.
         * @param {Function} transform(state: State, leaf: Leaf): Leaf
         * @return {Serializer}
         */

    }, {
        key: 'transformText',
        value: function transformText(transform) {
            var MARK = uid();

            return this.matchObject('text')

            // We can't process empty text node
            .filter(function (state) {
                var text = state.peek();
                return !text.isEmpty;
            })

            // Avoid infinite loop
            .filterNot(new Serializer().matchMark(MARK))

            // Escape all text
            .transformLeaves(function (state, leaf) {
                leaf = transform(state, leaf);

                return leaf.merge({
                    marks: leaf.marks.add(Mark.create({ type: MARK }))
                });
            });
        }
    }]);

    return Serializer;
}(RuleFunction);

/**
 * Normalize a node matching plugin option.
 *
 * @param {Function || Array || String} matchIn
 * @return {Function}
 */

function normalizeMatcher(matcher) {
    switch (typeOf(matcher)) {
        case 'function':
            return matcher;
        case 'array':
            return function (type) {
                return matcher.includes(type);
            };
        case 'string':
            return function (type) {
                return type == matcher;
            };
    }
}

module.exports = function () {
    return new Serializer();
};