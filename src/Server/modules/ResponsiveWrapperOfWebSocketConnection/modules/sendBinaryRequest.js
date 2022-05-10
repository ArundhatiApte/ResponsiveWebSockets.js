"use strict";

const {
  _namesOfPrivateProperties: { _connection }
} = require("./../../../../common/ResponsiveWebSocketConnection/ResponsiveWebSocketConnection");

const sendRequestByResponsiveConnection = require(
  "./../../../../common/ResponsiveWebSocketConnection/utils/sendRequestByResponsiveConnection"
);

const ResponsiveWrapperOfWebSocketConnection = require("./../ResponsiveWrapperOfWebSocketConnection");
const { _bufferForHeaderOfRequestOrResponse } = ResponsiveWrapperOfWebSocketConnection;

const {
  fillHeaderAsRequest: fillArrayBufferAsHeaderOfBinaryRequest
} = require("./../../../../common/ResponsiveWebSocketConnection/modules/messaging/binaryMessages/binaryMessager");

const sendBinaryChunksInRequest = function(responsiveConnection, idOfRequest, message) {
  const webSocket = responsiveConnection[_connection];
  fillArrayBufferAsHeaderOfBinaryRequest(idOfRequest, _bufferForHeaderOfRequestOrResponse);

  webSocket.sendFirstFragment(_bufferForHeaderOfRequestOrResponse, true);
  webSocket.sendLastFragment(message, true);
};

const sendBinaryRequest = function(message, maxTimeMsToWaitResponse) {
  return sendRequestByResponsiveConnection(
    this,
    message,
    maxTimeMsToWaitResponse,
    sendBinaryChunksInRequest
  );
};


module.exports = sendBinaryRequest;
