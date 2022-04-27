"use strict";

const createBinaryResponse = require("./messaging/messaging").binaryMessager.createResponseMessage;
const createTextResponse = require("./messaging/messaging").textMessager.createResponseMessage;

const SenderOfResponse = class {
  constructor(nonResponsiveWebSocketConnection, idOfMessage) {
    this[_webSocketConnection] = nonResponsiveWebSocketConnection;
    this[_idOfMessage] = idOfMessage;
  }

  sendBinaryResponse(message) {
    return this[_webSocketConnection].send(createBinaryResponse(this[_idOfMessage], message));
  }

  sendTextResponse(message) {
    return this[_webSocketConnection].send(createTextResponse(this[_idOfMessage], message));
  }
};

const _webSocketConnection = "_",
      _idOfMessage = "_i";

module.exports = SenderOfResponse;
