"use strict";

const ResponsiveWrapperOfWebSocketConnection = require("./../ResponsiveWrapperOfWebSocketConnection");
const { _bufferForHeader } = ResponsiveWrapperOfWebSocketConnection;

const {
  binaryMessager: {
    fillBufferAsHeaderOfResponse: fillBufferAsHeaderOfBinaryResponse
  },
  textMessager: {
    fillBufferAsHeaderOfResponse: fillBufferAsHeaderOfTextResponse
  }
} = require("./messaging/messaging");

const fillHeaderThenSendItAndFragments = require("./utilsForWebSocket/fillHeaderThenSendItAndFragments");

const SenderOfResponse = class {
  constructor(webSocket, idOfMessage) {
    this[_connection] = webSocket;
    this[_idOfMessage] = idOfMessage;
  }

  sendBinaryResponse(message) {
    const connection = this[_connection];
    fillBufferAsHeaderOfBinaryResponse(_bufferForHeader, this[_idOfMessage]);

    const messageIsBinary = true;
    connection.sendFirstFragment(_bufferForHeader, messageIsBinary);
    connection.sendLastFragment(message, messageIsBinary);
  }

  sendTextResponse(message) {
    const connection = this[_connection];
    fillBufferAsHeaderOfTextResponse(_bufferForHeader, this[_idOfMessage]);

    connection.sendFirstFragment(_bufferForHeader);
    connection.sendLastFragment(message);
  }

  sendFragmentsOfBinaryResponse() {
    return fillHeaderThenSendItAndFragments(
      this[_connection],
      _bufferForHeader,
      fillBufferAsHeaderOfBinaryResponse,
      this[_idOfMessage],
      true,
      arguments
    );
  }

  sendFragmentsOfTextResponse() {
    return fillHeaderThenSendItAndFragments(
      this[_connection],
      _bufferForHeader,
      fillBufferAsHeaderOfTextResponse,
      this[_idOfMessage],
      false,
      arguments
    );
  }
};

const _connection = Symbol(),
      _idOfMessage = Symbol();

module.exports = SenderOfResponse;
