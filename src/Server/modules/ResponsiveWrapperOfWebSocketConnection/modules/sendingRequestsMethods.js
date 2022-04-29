"use strict";

const {
  _namesOfPrivateProperties: { _connection }
} = require("./../../../../common/ResponsiveWebSocketConnection/ResponsiveWebSocketConnection");

const sendRequestByResponsiveConnection = require(
  "./../../../../common/ResponsiveWebSocketConnection/utils/sendRequestByResponsiveConnection"
);

const ResponsiveWrapperOfWebSocketConnection = require("./../ResponsiveWrapperOfWebSocketConnection");
const { _bufferForHeader } = ResponsiveWrapperOfWebSocketConnection;

const {
  binaryMessager: {
    fillBufferAsHeaderOfRequest: fillBufferAsHeaderOfBinaryRequest
  },
  textMessager: {
    fillBufferAsHeaderOfRequest: fillBufferAsHeaderOfTextRequest
  }
} = require("./messaging/messaging");

const sendBinaryChunksInRequest = function(responsiveConnection, idOfRequest, message) {
  const webSocket = responsiveConnection[_connection];
  fillBufferAsHeaderOfBinaryRequest(_bufferForHeader, idOfRequest);

  webSocket.sendFirstFragment(_bufferForHeader, true);
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

const sendTextChunksInRequest = function(responsiveConnection, idOfRequest, message) {
  const webSocket = responsiveConnection[_connection];
  fillBufferAsHeaderOfTextRequest(_bufferForHeader, idOfRequest);

  webSocket.sendFirstFragment(_bufferForHeader);
  webSocket.sendLastFragment(message);
};

const sendTextRequest = function(message, maxTimeMsToWaitResponse) {
  return sendRequestByResponsiveConnection(
    this,
    message,
    maxTimeMsToWaitResponse,
    sendTextChunksInRequest
  );
};

module.exports = {
  sendBinaryRequest,
  sendTextRequest
};
