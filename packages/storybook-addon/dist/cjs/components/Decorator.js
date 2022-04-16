"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WithApolloClient = void 0;

var _addons = require("@storybook/addons");

var _constants = require("../constants");

var _jsxRuntime = require("react/jsx-runtime");

var _excluded = ["Provider"];

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var WithApolloClient = function WithApolloClient(Story) {
  var _useState = (0, _addons.useState)([]),
      _useState2 = _slicedToArray(_useState, 2),
      operationsArr = _useState2[0],
      setOperationsArr = _useState2[1];

  var _ref = (0, _addons.useParameter)(_constants.PARAM_KEY, {}),
      Provider = _ref.Provider,
      providerProps = _objectWithoutProperties(_ref, _excluded);

  var _useGlobals = (0, _addons.useGlobals)(),
      _useGlobals2 = _slicedToArray(_useGlobals, 2),
      setGlobals = _useGlobals2[1];

  (0, _addons.useEffect)(function () {
    setGlobals(_defineProperty({}, "".concat(_constants.ADDON_ID, "/operations"), operationsArr));
  }, [operationsArr]);
  var handleResolvedOperation = (0, _addons.useCallback)(function (operationMeta) {
    setOperationsArr(function (prevState) {
      var existingOperation = prevState.filter(function (meta) {
        return meta.operationName === operationMeta.operationName;
      });

      if (existingOperation !== null && existingOperation !== void 0 && existingOperation.length) {
        var operationName = operationMeta.operationName;
        return [].concat(_toConsumableArray(prevState), [_objectSpread(_objectSpread({}, operationMeta), {}, {
          operationName: operationName,
          operationCount: existingOperation.length
        })]);
      }

      return [].concat(_toConsumableArray(prevState), [operationMeta]);
    });
  }, []);

  if (!Provider) {
    console.warn('storybook-addon-apollo-client: MockedProvider is missing from parameters in preview.js');
    return /*#__PURE__*/(0, _jsxRuntime.jsx)(Story, {});
  }

  return /*#__PURE__*/(0, _jsxRuntime.jsx)(Provider, _objectSpread(_objectSpread({}, providerProps), {}, {
    onResolved: handleResolvedOperation,
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(Story, {})
  }));
};

exports.WithApolloClient = WithApolloClient;