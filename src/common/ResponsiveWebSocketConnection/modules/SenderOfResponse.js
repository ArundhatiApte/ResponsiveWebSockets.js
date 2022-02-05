"use strict";

const {
  binaryMessager,
  textMessager
} = require("./messaging/messaging");

const SenderOfResponse = class {
  constructor(nonResponsiveWebSocketConnection, idOfMessage) {
    this[_nonResponsiveWebSocketConnection] = nonResponsiveWebSocketConnection;
    this[_idOfMessage] = idOfMessage;
  }
};

const _nonResponsiveWebSocketConnection = "_",
      _idOfMessage = "_i",
      Proto = SenderOfResponse.prototype;

const createMethodToSendResponse = function(createResponse, nameOfSendigResponseMethod) {
  return function sendResponse(message) {
    const messageWithHeader = createResponse(this[_idOfMessage], message);
    return this[_nonResponsiveWebSocketConnection][nameOfSendigResponseMethod](messageWithHeader);
  };
};

Proto.sendBinaryResponse = createMethodToSendResponse(
  binaryMessager.createBinaryResponseToAwaitingResponseMessage, "sendBinaryMessage");
  
Proto.sendTextResponse = createMethodToSendResponse(
  textMessager.createTextResponseToAwaitingResponseMessage, "sendTextMessage");

module.exports = SenderOfResponse;
