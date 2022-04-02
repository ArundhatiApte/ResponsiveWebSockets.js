"use strict";

const {
  textMessager,
  binaryMessager
} = require("./../modules/messaging/messaging");

const { contentTypesOfMessages } = require("./../../common/ResponsiveConnection/ResponsiveConnection");

const createMethodToFireEventOnMessageToInnerWebSocket = require(
  "./../../common/ResponsiveConnection/utils/createMethodToFireEventOnMessageToInnerWebSocket"
);
const SenderOfResponse = require("./../modules/SenderOfResponse");

const {
  _connection,
  _idOfRequestToPromise,
  _onBinaryRequest,
  _onTextRequest,
  _onUnrequestingBinaryMessage,
  _onUnrequestingTextMessage,
} = require("./../../common/ResponsiveConnection/ResponsiveConnection")._namesOfPrivateProperties;

const emitEventByIncominMessage = function(event) {
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
  _emitEventByIncomingBinaryMessage(this, data);
};

const createSenderOfResponse = function(rwsClient, idOfMessage) {
  return new SenderOfResponse(rwsClient[_connection], idOfMessage);
};

const _emitEventByIncomingBinaryMessage = createMethodToFireEventOnMessageToInnerWebSocket(
  _idOfRequestToPromise,
  binaryMessager.extractTypeOfIncomingMessage,
  binaryMessager.extractIdOfMessage,
  contentTypesOfMessages.binary,

  _onUnrequestingBinaryMessage,
  binaryMessager.startIndexOfBodyInUnrequestingMessage,
  
  _onBinaryRequest,
  binaryMessager.startIndexOfBodyInRequest,
  createSenderOfResponse
);

const _emitEventByIncomingTextMessage = createMethodToFireEventOnMessageToInnerWebSocket(
  _idOfRequestToPromise,
  textMessager.extractTypeOfIncomingMessage,
  textMessager.extractIdOfMessage,
  contentTypesOfMessages.text,

  _onUnrequestingTextMessage,
  textMessager.startIndexOfBodyInUnrequestingMessage,
  
  _onTextRequest,
  textMessager.startIndexOfBodyInRequest,
  createSenderOfResponse
);

module.exports = emitEventByIncominMessage;
