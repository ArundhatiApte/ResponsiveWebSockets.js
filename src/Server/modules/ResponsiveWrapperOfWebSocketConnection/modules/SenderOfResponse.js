"use strict";

const ResponsiveWrapperOfWebSocketConnection = require("./../ResponsiveWrapperOfWebSocketConnection");
const { _symbolOfBufferForHeader } = ResponsiveWrapperOfWebSocketConnection;

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
    const header = ResponsiveWrapperOfWebSocketConnection[_symbolOfBufferForHeader];
    fillBufferAsHeaderOfBinaryResponse(header, this[_idOfMessage]);

    const messageIsBinary = true;
    connection.sendFirstFragment(header, messageIsBinary);
    connection.sendLastFragment(message, messageIsBinary);
  }

  sendTextResponse(message) {
    const connection = this[_connection];
    const header = ResponsiveWrapperOfWebSocketConnection[_symbolOfBufferForHeader];
    fillBufferAsHeaderOfTextResponse(header, this[_idOfMessage]);

    connection.sendFirstFragment(header);
    connection.sendLastFragment(message);
  }

  sendFragmentsOfBinaryResponse() {
    return fillHeaderThenSendItAndFragments(
      this[_connection],
      ResponsiveWrapperOfWebSocketConnection[_symbolOfBufferForHeader],
      fillBufferAsHeaderOfBinaryResponse,
      this[_idOfMessage],
      true,
      arguments
    );
  }

  sendFragmentsOfTextResponse() {
    return fillHeaderThenSendItAndFragments(
      this[_connection],
      ResponsiveWrapperOfWebSocketConnection[_symbolOfBufferForHeader],
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
