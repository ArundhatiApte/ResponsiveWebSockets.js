"use strict";

const {
  _namesOfProtectedProperties: { _connection }
} = require("./../../../../../common/ResponsiveWebSocketConnection/ResponsiveWebSocketConnection");

const { _headerOfUnrequestingMessage } = require("./../../ResponsiveWrapperOfWebSocketConnection");
const sendHeaderAndFragments = require("./../utilsForWebSocket/sendHeaderAndFragments");

const sendFragmentsOfUnrequestingBinaryMessage = function() {
  return sendHeaderAndFragments(this[_connection], _headerOfUnrequestingMessage, true, arguments);
};

module.exports = sendFragmentsOfUnrequestingBinaryMessage;
