"use strict";

const { _bufferForHeaderOfRequestOrResponse } = require("./../ResponsiveWrapperOfWebSocketConnection");

const {
  fillHeaderAsResponse: fillArrayBufferAsHeaderOfBinaryResponse
} = require("./../../../../common/ResponsiveWebSocketConnection/modules/messaging/binaryMessages/binaryMessager");

const fillHeaderThenSendItAndFragments = require("./utilsForWebSocket/fillHeaderThenSendItAndFragments");

const SenderOfResponse = class {
  constructor(webSocket, idOfMessage) {
    this[_connection] = webSocket;
    this[_idOfMessage] = idOfMessage;
  }

  sendBinaryResponse(message) {
    const connection = this[_connection];
    fillArrayBufferAsHeaderOfBinaryResponse(this[_idOfMessage], _bufferForHeaderOfRequestOrResponse);

    const messageIsBinary = true;
    connection.sendFirstFragment(_bufferForHeaderOfRequestOrResponse, messageIsBinary);
    connection.sendLastFragment(message, messageIsBinary);
  }

  sendFragmentsOfBinaryResponse() {
    return fillHeaderThenSendItAndFragments(
      this[_connection],
      _bufferForHeaderOfRequestOrResponse,
      fillArrayBufferAsHeaderOfBinaryResponse,
      this[_idOfMessage],
      true,
      arguments
    );
  }
};

const _connection = Symbol(),
      _idOfMessage = Symbol();

module.exports = SenderOfResponse;
