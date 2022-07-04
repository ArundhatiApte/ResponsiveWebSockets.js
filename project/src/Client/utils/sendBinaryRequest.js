"use strict";

const { _connection } = require(
  "./../../common/ResponsiveWebSocketConnection/ResponsiveWebSocketConnection"
)._namesOfProtectedProperties;

const sendRequestByResponsiveConnection = require(
  "./../../common/ResponsiveWebSocketConnection/utils/sendRequestByResponsiveConnection"
);
const fillHeaderAsRequest = require(
  "./../../common/ResponsiveWebSocketConnection/modules/messaging/binaryMessages/binaryMessager"
).fillHeaderAsRequest;

const sendBinaryRequest = function(messageInArrayBuffer, maxTimeMsToWaitResponse) {
  return sendRequestByResponsiveConnection(this, messageInArrayBuffer, maxTimeMsToWaitResponse, sendMessageOfRequest);
};

const sendMessageOfRequest = function(responsiveConnection, idOfRequest, message) {
  fillHeaderAsRequest(idOfRequest, message);
  responsiveConnection[_connection].send(message);
};

module.exports = sendBinaryRequest;
