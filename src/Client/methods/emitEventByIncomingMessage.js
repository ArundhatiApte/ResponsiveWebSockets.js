"use strict";

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

const {
  binary: contentTypesOfMessages_binary,
  text: contentTypesOfMessages_text
} = require("./../../common/ResponsiveConnection/ResponsiveConnection").contentTypesOfMessages;

const listenEventOfMessageToInnerWebSocket = require(
  "./../../common/ResponsiveConnection/utils/listenEventOfMessageToInnerWebSocket"
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
  _emitEventByIncomingBinaryMessage(this, data);
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
  
    responsiveConnection,
    message
  );
};

module.exports = emitEventByIncomingMessage;
