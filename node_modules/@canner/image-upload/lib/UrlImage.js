"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _templateObject = _taggedTemplateLiteral(["\n  background-image: url(", ");\n  width: 100%;\n  height: 300px;\n  background-size: contain;\n  background-repeat: no-repeat;\n"], ["\n  background-image: url(", ");\n  width: 100%;\n  height: 300px;\n  background-size: contain;\n  background-repeat: no-repeat;\n"]);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _antd = require("antd");

var _reactIntl = require("react-intl");

var _reactLoadingImage = require("react-loading-image");

var _reactLoadingImage2 = _interopRequireDefault(_reactLoadingImage);

var _styledComponents = require("styled-components");

var _styledComponents2 = _interopRequireDefault(_styledComponents);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var PreviewImg = _styledComponents2.default.div(_templateObject, function (props) {
  return props.src;
});

var UrlImage = function (_Component) {
  _inherits(UrlImage, _Component);

  function UrlImage(props) {
    _classCallCheck(this, UrlImage);

    var _this = _possibleConstructorReturn(this, (UrlImage.__proto__ || Object.getPrototypeOf(UrlImage)).call(this, props));

    _this.state = {
      url: null,
      confirmDisabled: true
    };
    _this.onChange = _this.onChange.bind(_this);
    _this.onClick = _this.onClick.bind(_this);
    _this.confirmDisable = _this.confirmDisable.bind(_this);
    return _this;
  }

  _createClass(UrlImage, [{
    key: "onChange",
    value: function onChange(e) {
      this.setState({
        confirmDisabled: true,
        url: e.target.value
      });
    }
  }, {
    key: "confirmDisable",
    value: function confirmDisable(disable) {
      this.setState({
        confirmDisabled: disable
      });
    }
  }, {
    key: "onClick",
    value: function onClick() {
      var url = this.state.url;
      var _props = this.props,
          closeEditPopup = _props.closeEditPopup,
          onChange = _props.onChange;


      if (url) {
        onChange([url]);
        this.setState({
          url: null,
          confirmDisabled: true
        });

        // close popup
        if (closeEditPopup) {
          closeEditPopup();
        }
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _state = this.state,
          url = _state.url,
          confirmDisabled = _state.confirmDisabled;

      return _react2.default.createElement(
        _antd.Row,
        null,
        _react2.default.createElement(
          _antd.Col,
          null,
          _react2.default.createElement(_reactIntl.FormattedMessage, { id: "imgupload.url.title" }),
          _react2.default.createElement(_antd.Input, { onChange: this.onChange, value: url }),
          _react2.default.createElement(
            _antd.Button,
            {
              style: { margin: "10px 0" },
              type: "primary",
              disabled: confirmDisabled,
              onClick: this.onClick
            },
            _react2.default.createElement(_reactIntl.FormattedMessage, { id: "imgupload.btn.confirm" })
          ),
          url && confirmDisabled && _react2.default.createElement(_reactLoadingImage2.default, {
            src: url,
            onLoad: function onLoad() {
              return _this2.confirmDisable(false);
            },
            error: function error() {
              return _react2.default.createElement(_antd.Alert, {
                message: _react2.default.createElement(_reactIntl.FormattedMessage, { id: "imgupload.url.error" }),
                type: "error"
              });
            },
            loading: function loading() {
              return _react2.default.createElement(
                "div",
                null,
                _react2.default.createElement(_antd.Icon, { type: "loading", style: { fontSize: 24 }, spin: true })
              );
            },
            image: function image(props) {
              return _react2.default.createElement(PreviewImg, props);
            }
          }),
          url && !confirmDisabled && _react2.default.createElement(PreviewImg, { src: url })
        )
      );
    }
  }]);

  return UrlImage;
}(_react.Component);

exports.default = UrlImage;