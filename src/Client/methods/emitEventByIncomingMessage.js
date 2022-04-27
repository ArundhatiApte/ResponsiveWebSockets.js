"use strict";

const {
  contentTypesOfMessages: {
    binary: contentTypesOfMessages_binary,
    text: contentTypesOfMessages_text
  },
  _namesOfPrivateProperties: {
    _connection,
    _idOfRequestToPromise,

    _onMalformedBinaryMessage,
    _onMalformedTextMessage,

    _onBinaryRequest,
    _onTextRequest,

    _onUnrequestingBinaryMessage,
    _onUnrequestingTextMessage,
  }
} = require("./../../common/ResponsiveWebSocketConnection/ResponsiveWebSocketConnection");

const listenEventOfMessageToInnerWebSocket = require(
  "./../../common/ResponsiveWebSocketConnection/utils/listenEventOfMessageToInnerWebSocket"
);

const {
  textMessager: {
    extractTypeOfIncomingMessage: extractTypeOfIncomingTextMessage,
    extractIdOfMessage: extractIdOfTextMessage,
    startIndexOfBodyInUnrequestingMessage: startIndexOfBodyInUnrequestingTextMessage,
    startIndexOfBodyInRequest: startIndexOfBodyInTextRequest
  },
  binaryMessager: {
    extractTypeOfIncomingMessage: extractTypeOfIncomingBinaryMessage,
    extractIdOfMessage: extractIdOfBinaryMessage,
    startIndexOfBodyInUnrequestingMessage: startIndexOfBodyInUnrequestingBinaryMessage,
    startIndexOfBodyInRequest: startIndexOfBodyInBinaryRequest
  }
} = require("./../modules/messaging/messaging");

const SenderOfResponse = require("./../modules/SenderOfResponse");

const emitEventByIncomingMessage = function(event) {
  return _emitOnFirstMessage.call(this, event);
};

const _emitOnFirstMessage = async function(event) {
  let data = event.data;
  if (typeof data === "string") {
    return _emitEventByIncomingTextMessage(this, data);
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
    return _emitEventByIncomingTextMessage(this, data);
  }
  _emitEventByIncomingBinaryMessage(this, data);
};

const _emitOnMessageWithBlob = async function(event) {
  const data = event.data;
  if (typeof data === "string") {
    return _emitEventByIncomingTextMessage(this, data);
  }
  const bytes = await data.arrayBuffer();
  _emitEventByIncomingBinaryMessage(this, bytes);
};

const _emitEventByIncomingBinaryMessage = function(responsiveConnection, message) {
  return listenEventOfMessageToInnerWebSocket(
    extractTypeOfIncomingBinaryMessage,
    extractIdOfBinaryMessage,
    contentTypesOfMessages_binary,

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

const _emitEventByIncomingTextMessage = function(responsiveConnection, message) {
  return listenEventOfMessageToInnerWebSocket(
    extractTypeOfIncomingTextMessage,
    extractIdOfTextMessage,
    contentTypesOfMessages_text,

    _onUnrequestingTextMessage,
    startIndexOfBodyInUnrequestingTextMessage,

    _onTextRequest,
    startIndexOfBodyInTextRequest,
    SenderOfResponse,

    _onMalformedTextMessage,

    responsiveConnection,
    message
  );
};

module.exports = emitEventByIncomingMessage;
