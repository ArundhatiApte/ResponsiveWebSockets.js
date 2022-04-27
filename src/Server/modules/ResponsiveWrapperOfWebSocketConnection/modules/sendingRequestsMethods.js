"use strict";

const {
  _namesOfPrivateProperties: { _connection }
} = require("./../../../../common/ResponsiveWebSocketConnection/ResponsiveWebSocketConnection");

const sendRequestByResponsiveConnection = require(
  "./../../../../common/ResponsiveWebSocketConnection/utils/sendRequestByResponsiveConnection"
);

const ResponsiveWrapperOfWebSocketConnection = require("./../ResponsiveWrapperOfWebSocketConnection");
const { _symbolOfBufferForHeader } = ResponsiveWrapperOfWebSocketConnection;

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
  const header = ResponsiveWrapperOfWebSocketConnection[_symbolOfBufferForHeader];
  fillBufferAsHeaderOfBinaryRequest(header, idOfRequest);

  webSocket.sendFirstFragment(header, true);
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
  const header = ResponsiveWrapperOfWebSocketConnection[_symbolOfBufferForHeader];
  fillBufferAsHeaderOfTextRequest(header, idOfRequest);

  webSocket.sendFirstFragment(header);
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
