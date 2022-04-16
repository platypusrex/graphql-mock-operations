"use strict";

var _addons = require("@storybook/addons");

var _constants = require("../constants");

var _Panel = require("../components/Panel");

_addons.addons.register(_constants.ADDON_ID, function () {
  _addons.addons.add(_constants.ADDON_ID, {
    type: _addons.types.PANEL,
    title: 'Apollo Operations',
    paramKey: _constants.PARAM_KEY,
    render: _Panel.Panel
  });
});