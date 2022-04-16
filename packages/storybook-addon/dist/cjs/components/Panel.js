"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Panel = void 0;

var _react = _interopRequireWildcard(require("react"));

var _api = require("@storybook/api");

var _theming = require("@storybook/theming");

var _components = require("@storybook/components");

var _constants = require("../constants");

var _jsxRuntime = require("react/jsx-runtime");

var _templateObject, _templateObject2, _templateObject3, _templateObject4;

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var PanelContainer = _theming.styled.div(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  padding: 20px;\n"])));

var ContentContainer = _theming.styled.div(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  padding: 20px 15px;\n"])));

var PanelCard = _theming.styled.div(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n  margin-bottom: 20px;\n"])));

var PanelTitle = (0, _theming.styled)(_components.H2)(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n  font-weight: bold;\n  font-size: 16px;\n  border-bottom: 0;\n"])));

var Panel = function Panel(_ref) {
  var _ref$active = _ref.active,
      active = _ref$active === void 0 ? false : _ref$active,
      key = _ref.key;

  var _useGlobals = (0, _api.useGlobals)(),
      _useGlobals2 = _slicedToArray(_useGlobals, 1),
      globals = _useGlobals2[0];

  var _useState = (0, _react.useState)(0),
      _useState2 = _slicedToArray(_useState, 2),
      activeCardIndex = _useState2[0],
      setActiveCardIndex = _useState2[1];

  var operationMeta = globals["".concat(_constants.ADDON_ID, "/operations")];
  var activeMeta = operationMeta === null || operationMeta === void 0 ? void 0 : operationMeta[activeCardIndex];

  var handleSelectChange = function handleSelectChange(e) {
    var currentIdx = Number(e.currentTarget.value);
    setActiveCardIndex(currentIdx);
  };

  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_components.AddonPanel, {
    active: active,
    children: operationMeta && (operationMeta === null || operationMeta === void 0 ? void 0 : operationMeta.length) > 0 && /*#__PURE__*/(0, _jsxRuntime.jsxs)(PanelContainer, {
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_components.Form.Field, {
        label: "Operations",
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_components.Form.Select, {
          size: "auto",
          value: activeCardIndex,
          onChange: handleSelectChange,
          children: operationMeta.map(function (_ref2, i) {
            var operationName = _ref2.operationName,
                operationCount = _ref2.operationCount;
            return /*#__PURE__*/(0, _jsxRuntime.jsxs)("option", {
              value: i,
              children: [i + 1, ". ", operationName, " ", operationCount ? "(".concat(operationCount, ")") : '']
            }, operationName + i);
          })
        })
      }), activeMeta ? /*#__PURE__*/(0, _jsxRuntime.jsxs)(ContentContainer, {
        children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)(PanelCard, {
          children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(PanelTitle, {
            children: "Query"
          }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_components.SyntaxHighlighter, {
            language: "graphql",
            copyable: true,
            bordered: true,
            padded: true,
            children: activeMeta.query
          })]
        }), Object.keys(activeMeta.variables).length > 0 && /*#__PURE__*/(0, _jsxRuntime.jsxs)(PanelCard, {
          children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(PanelTitle, {
            children: "Variables"
          }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_components.SyntaxHighlighter, {
            language: "json",
            copyable: true,
            bordered: true,
            padded: true,
            children: JSON.stringify(activeMeta.variables, null, 2)
          })]
        }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(PanelCard, {
          children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(PanelTitle, {
            children: "Result"
          }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_components.SyntaxHighlighter, {
            language: "json",
            copyable: true,
            bordered: true,
            padded: true,
            children: JSON.stringify(activeMeta.result, null, 2)
          })]
        })]
      }) : null]
    })
  }, key);
};

exports.Panel = Panel;