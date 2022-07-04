"use strict";

const {
  _namesOfProtectedProperties: {
    _connection,
    _idOfRequestToPromise,

    _onMalformedBinaryMessage,
    _onBinaryRequest,
    _onUnrequestingBinaryMessage,
    _onTextMessage
  },
  _acceptTextMessage
} = require("./../../common/ResponsiveWebSocketConnection/ResponsiveWebSocketConnection");

const acceptMessageFromInnerWebSocket = require(
  "./../../common/ResponsiveWebSocketConnection/utils/acceptMessageFromInnerWebSocket"
);

const {
  extractTypeOfMessage: extractTypeOfBinaryMessage,
  extractIdOfMessage: extractIdOfBinaryMessage,

  sizeOfHeaderForRequest: startIndexOfBodyInBinaryRequest,
  sizeOfHeaderForUnrequestingMessage: startIndexOfBodyInUnrequestingBinaryMessage
} = require("./../../common/ResponsiveWebSocketConnection/modules/messaging/binaryMessages/binaryMessager");

const SenderOfResponse = require("./SenderOfResponse");

const emitEventByIncomingMessage = function(event) {
  return _emitOnFirstMessage.call(this, event);
};

const _emitOnFirstMessage = async function(event) {
  let data = event.data;
  if (typeof data === "string") {
    return _acceptTextMessage(this, data);
  }

  if (data instanceof ArrayBuffer) {
    this[_connection].onmessage = _emitOnMessageWithArrayBuffer.bind(this);
  } else {
    data = await data.arrayBuffer();
    this[_connection].onmessage = _emitOnMessageWithBlob.bind(this);
  }

  _emitEventByIncomingBinaryMessage(this, data);
};

const _emitOnMessageWithArrayBuffer = function(event) {
  const data = event.data;
  if (typeof data === "string") {
    return _acceptTextMessage(this, data);
  }
  _emitEventByIncomingBinaryMessage(this, data);
};

const _emitOnMessageWithBlob = async function(event) {
  const data = event.data;
  if (typeof data === "string") {
    return _acceptTextMessage(this, data);
  }
  const bytes = await data.arrayBuffer();
  _emitEventByIncomingBinaryMessage(this, bytes);
};

const _emitEventByIncomingBinaryMessage = function(responsiveConnection, message) {
  return acceptMessageFromInnerWebSocket(
    extractTypeOfBinaryMessage,
    extractIdOfBinaryMessage,

    _onUnrequestingBinaryMessage,
    startIndexOfBodyInUnrequestingBinaryMessage,

    _onBinaryRequest,
    startIndexOfBodyInBinaryRequest,
    SenderOfResponse,

    _onMalformedBinaryMessage,

    responsiveConnection,
    message
  );
};

module.exports = emitEventByIncomingMessage;
