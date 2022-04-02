"use strict";

const createBinaryResponse = require("./messaging/messaging").binaryMessager.createResponseMessage;
const createTextResponse = require("./messaging/messaging").textMessager.createResponseMessage;

const SenderOfResponse = class {
  constructor(nonResponsiveWebSocketConnection, idOfMessage) {
    this[_nonResponsiveWebSocketConnection] = nonResponsiveWebSocketConnection;
    this[_idOfMessage] = idOfMessage;
  }

  sendBinaryResponse(message) {
    return this[_nonResponsiveWebSocketConnection].send(createBinaryResponse(this[_idOfMessage], message));
  }

  sendTextResponse(message) {
    return this[_nonResponsiveWebSocketConnection].send(createTextResponse(this[_idOfMessage], message));
  }
};

const _nonResponsiveWebSocketConnection = "_",
      _idOfMessage = "_i";

module.exports = SenderOfResponse;
