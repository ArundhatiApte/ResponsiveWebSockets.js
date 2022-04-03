"use strict";

const {
  _connection
} = require("./../../../../common/ResponsiveConnection/ResponsiveConnection")._namesOfPrivateProperties;

const sendRequestByResponsiveConnection = require(
  "./../../../../common/ResponsiveConnection/utils/sendRequestByResponsiveConnection"
);

const {
  binaryMessager: {
    createHeaderOfRequest: createHeaderOfBinaryRequest
  },
  textMessager: {
    createHeaderOfRequest: createHeaderOfTextRequest
  }
} = require("./messaging/messaging");

const sendBinaryChunksInRequest = function(responsiveConnection, idOfRequest, message) {
  const webSocket = responsiveConnection[_connection];
  const header = createHeaderOfBinaryRequest(idOfRequest);
  const messageIsBinary = true;
  webSocket.sendFirstFragment(header, messageIsBinary);
  webSocket.sendLastFragment(message, messageIsBinary);
};

const sendBinaryRequest = function(
  message,
  maxTimeMsToWaitResponse
) {
  return sendRequestByResponsiveConnection(
    this,
    message,
    maxTimeMsToWaitResponse,
    sendBinaryChunksInRequest
  );
};

const sendTextChunksInRequest = function(responsiveConnection, idOfRequest, message) {
  const webSocket = responsiveConnection[_connection];
  const header = createHeaderOfTextRequest(idOfRequest);
  webSocket.sendFirstFragment(header);
  webSocket.sendLastFragment(message);
};

const sendTextRequest = function(
  message,
  maxTimeMsToWaitResponse
) {
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
