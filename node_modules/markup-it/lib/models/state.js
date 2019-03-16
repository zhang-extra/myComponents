'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _require = require('immutable'),
    Record = _require.Record,
    List = _require.List,
    Map = _require.Map,
    Set = _require.Set;

var _require2 = require('slate'),
    Text = _require2.Text,
    Block = _require2.Block,
    Document = _require2.Document;

var BLOCKS = require('../constants/blocks');
var RuleFunction = require('./rule-function');

/*
    State stores the global state when serializing a document or deseriaizing a text.
 */

var DEFAULTS = {
    text: '',
    nodes: List(),
    marks: Set(),
    object: String('document'),
    rulesSet: Map(),
    depth: 0,
    props: Map()
};

var State = function (_Record) {
    _inherits(State, _Record);

    function State() {
        _classCallCheck(this, State);

        return _possibleConstructorReturn(this, (State.__proto__ || Object.getPrototypeOf(State)).apply(this, arguments));
    }

    _createClass(State, [{
        key: 'use',


        /**
         * Change set of rules to use.
         *
         * @param  {String} object
         * @return {State} state
         */
        value: function use(object) {
            return this.merge({ object: object });
        }

        /**
         * Set a prop for the state.
         *
         * @param  {String} key
         * @param  {Mixed} value
         * @return {State} state
         */

    }, {
        key: 'setProp',
        value: function setProp(key, value) {
            var props = this.props;

            props = props.set(key, value);

            return this.merge({ props: props });
        }

        /**
         * Get a prop from the state
         *
         * @param  {String} key
         * @param  {Mixed} def
         * @return {Mixed}
         */

    }, {
        key: 'getProp',
        value: function getProp(key, def) {
            var props = this.props;

            return props.get(key, def);
        }

        /**
         * Write a string. This method can be used when serializing nodes into text.
         *
         * @param  {String} string
         * @return {State} state
         */

    }, {
        key: 'write',
        value: function write(string) {
            var text = this.text;

            text += string;
            return this.merge({ text: text });
        }

        /**
         * Replace all the text in the state.
         *
         * @param  {String} text
         * @return {State} state
         */

    }, {
        key: 'replaceText',
        value: function replaceText(text) {
            return this.merge({ text: text });
        }

        /**
         * Peek the first node in the stack
         *
         * @return {Node} node
         */

    }, {
        key: 'peek',
        value: function peek() {
            return this.nodes.first();
        }

        /**
         * Shift the first node from the stack
         *
         * @return {State} state
         */

    }, {
        key: 'shift',
        value: function shift() {
            var nodes = this.nodes;

            nodes = nodes.shift();
            return this.merge({ nodes: nodes });
        }

        /**
         * Unshift a node in the list
         *
         * @param  {Node} node
         * @return {State} state
         */

    }, {
        key: 'unshift',
        value: function unshift(node) {
            var nodes = this.nodes;

            nodes = nodes.unshift(node);
            return this.merge({ nodes: nodes });
        }

        /**
         * Push a new node to the stack. This method can be used when deserializing
         * a text into a set of nodes.
         *
         * @param  {Node | List<Node>} node
         * @return {State} state
         */

    }, {
        key: 'push',
        value: function push(node) {
            var nodes = this.nodes;


            if (List.isList(node)) {
                nodes = nodes.concat(node);
            } else {
                nodes = nodes.push(node);
            }

            return this.merge({ nodes: nodes });
        }

        /**
         * Push a new mark to the active list
         *
         * @param  {Mark} mark
         * @return {State} state
         */

    }, {
        key: 'pushMark',
        value: function pushMark(mark) {
            var marks = this.marks;

            marks = marks.add(mark);
            return this.merge({ marks: marks });
        }

        /**
         * Generate a new text container.
         *
         * @param  {String} text
         * @return {Node} text
         */

    }, {
        key: 'genText',
        value: function genText() {
            var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
            var marks = this.marks;


            var node = Text.create({ text: text, marks: marks });

            if (this.object == 'block') {
                node = Block.create({
                    type: BLOCKS.TEXT,
                    nodes: [node]
                });
            }

            return node;
        }

        /**
         * Push a new text node.
         *
         * @param  {String} text
         * @return {State} state
         */

    }, {
        key: 'pushText',
        value: function pushText(text) {
            return this.push(this.genText(text));
        }

        /**
         * Move this state to a upper level
         *
         * @param  {Number} string
         * @return {State} state
         */

    }, {
        key: 'up',
        value: function up() {
            var depth = this.depth;

            depth--;
            return this.merge({ depth: depth });
        }

        /**
         * Move this state to a lower level
         *
         * @param  {Number} string
         * @return {State} state
         */

    }, {
        key: 'down',
        value: function down() {
            var depth = this.depth;

            depth++;
            return this.merge({ depth: depth });
        }

        /**
         * Skip "n" characters in the text.
         * @param  {Number} n
         * @return {State} state
         */

    }, {
        key: 'skip',
        value: function skip(n) {
            var text = this.text;

            text = text.slice(n);
            return this.merge({ text: text });
        }

        /**
         * Parse current text buffer
         * @return {State} state
         */

    }, {
        key: 'lex',
        value: function lex() {
            var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            var state = this;
            var text = state.text;
            var _opts$rest = opts.rest,
                rest = _opts$rest === undefined ? '' : _opts$rest,
                _opts$trim = opts.trim,
                trim = _opts$trim === undefined ? true : _opts$trim,
                _opts$stopAt = opts.stopAt,
                stopAt = _opts$stopAt === undefined ? function (newState, prevState) {
                return null;
            } : _opts$stopAt;


            var startState = state;
            var trimedRest = trim ? rest.trim() : rest;
            if (trimedRest) {
                startState = startState.pushText(trimedRest);
            }

            // No text to parse, we return
            if (!text) {
                return startState;
            }

            // We apply the rules to find the first matching one
            var newState = startState.applyRules('deserialize');

            // Same state cause an infinite loop
            if (newState == startState) {
                throw new Error('A rule returns an identical state, returns undefined instead when passing.');
            }

            // No rules match, we move and try the next char
            if (!newState) {
                return state.skip(1).lex(_extends({}, opts, {
                    rest: rest + text[0]
                }));
            }

            // Should we stop ?
            var stop = stopAt(newState, state);
            if (stop) {
                return stop;
            }

            // Otherwise we keep parsing
            return newState.lex(opts);
        }

        /**
         * Apply first matching rule
         * @param  {String} text
         * @return {State} state
         */

    }, {
        key: 'applyRules',
        value: function applyRules(object) {
            var state = this;
            var rules = state.rules;

            var newState = void 0;

            rules.filter(function (rule) {
                return rule[object];
            }).forEach(function (rule) {
                newState = RuleFunction.exec(rule[object], state);
                if (newState) {
                    return false;
                }
            });

            return newState;
        }

        /**
         * Deserialize a text into a Node.
         * @param  {String} text
         * @return {List<Node>} nodes
         */

    }, {
        key: 'deserialize',
        value: function deserialize(text) {
            var state = this.down().merge({ text: text, nodes: List() }).lex();

            return state.nodes;
        }

        /**
         * Deserialize a string content into a Document.
         * @param  {String} text
         * @return {Document} document
         */

    }, {
        key: 'deserializeToDocument',
        value: function deserializeToDocument(text) {
            var document = this.use('document').deserialize(text).get(0) || Document.create();

            var nodes = document.nodes;

            // We should never return an empty document

            if (nodes.size === 0) {
                nodes = nodes.push(Block.create({
                    type: BLOCKS.PARAGRAPH,
                    nodes: [Text.create()]
                }));
            }

            return document.merge({ nodes: nodes });
        }

        /**
         * Serialize nodes into text
         * @param  {List<Node>} nodes
         * @return {String} text
         */

    }, {
        key: 'serialize',
        value: function serialize(nodes) {
            return this.down().merge({
                text: '',
                nodes: List(nodes)
            })._serialize().text;
        }

        /**
         * Serialize a document into text
         * @param  {Document} document
         * @return {String} text
         */

    }, {
        key: 'serializeDocument',
        value: function serializeDocument(document) {
            return this.use('document').serialize([document]);
        }

        /**
         * Serialize a node into text
         * @param  {Node} node
         * @return {String} text
         */

    }, {
        key: 'serializeNode',
        value: function serializeNode(node) {
            return this.serialize([node]);
        }

        /**
         * Update the state to serialize it.
         * @return {State} state
         */

    }, {
        key: '_serialize',
        value: function _serialize() {
            var state = this;

            if (state.nodes.size == 0) {
                return state;
            }

            state = state.applyRules('serialize');

            // No rule can match this node
            if (!state) {
                throw new Error('No rule match node ' + this.peek().object + '#' + (this.peek().type || ''));
            }

            // Same state cause an infinite loop
            if (state == this) {
                throw new Error('A rule returns an identical state, returns undefined instead when passing.');
            }

            return state._serialize();
        }
    }, {
        key: 'rules',


        /**
         * Return list of rules currently being used
         * @return {List} rules
         */
        get: function get() {
            var object = this.object,
                rulesSet = this.rulesSet;

            return rulesSet.get(object, List());
        }
    }], [{
        key: 'create',


        /**
         * Create a new state from a set of rules.
         * @param  {Object} rulesSet
         * @param  {Object} props
         * @return {State} state
         */
        value: function create() {
            var rulesSet = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
            var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            return new State({
                rulesSet: Map(rulesSet).map(List),
                props: Map(props)
            });
        }
    }]);

    return State;
}(Record(DEFAULTS));

module.exports = State;