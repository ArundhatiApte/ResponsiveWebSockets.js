"use strict";

const {
  _namesOfPrivateProperties: { _connection }
} = require("./../../../../../common/ResponsiveWebSocketConnection/ResponsiveWebSocketConnection");

const { _headerOfUnrequestingMessage } = require("./../../ResponsiveWrapperOfWebSocketConnection");

const sendUnrequestingBinaryMessage = function(message) {
  const connection = this[_connection];
  connection.sendFirstFragment(_headerOfUnrequestingMessage, true);
  connection.sendLastFragment(message, true);
};

module.exports = sendUnrequestingBinaryMessage;
