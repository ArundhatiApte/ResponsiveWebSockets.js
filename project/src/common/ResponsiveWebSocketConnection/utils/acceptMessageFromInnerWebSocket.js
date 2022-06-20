"use strict";

const {
  request: typesOfIncomingMessages_request,
  response: typesOfIncomingMessages_response,
  unrequestingMessage: typesOfIncomingMessages_unrequestingMessage,
} = require("./../modules/messaging/typesOfIncomingMessages");

const ErrorAtParsing = require("./../modules/messaging/ErrorAtParsing");

const {
  _connection,
  _idOfRequestToPromise
} = require("./../ResponsiveWebSocketConnection")._namesOfPrivateProperties;

const {
  create: entryAboutPromiseOfRequest_create,
  nameOfPromiseResolver: entryAboutPromiseOfRequest_nameOfPromiseResolver,
  nameOfTimeout: entryAboutPromiseOfRequest_nameOfTimeout
} = require("./entryAboutPromiseOfRequest");

const acceptMessageFromInnerWebSocket = function(
  extractTypeOfIncomingMessage,
  extractIdOfMessage,

  nameOfUnrequestingMessageEventListener,
  startIndexOfBodyInUnrequestingMessage,

  nameOfRequestEventListener,
  startIndexOfBodyInRequest,
  SenderOfResponse,

  nameOfMalformedMessageListener,

  responsiveWebSocket,
  incomingMessage
) {
  let typeOfMessage;
  try {
    typeOfMessage = extractTypeOfIncomingMessage(incomingMessage);
  } catch(error) {
    _emitMalformedMessageEvent(responsiveWebSocket, nameOfMalformedMessageListener, incomingMessage);
    return;
  }

  if (typeOfMessage === typesOfIncomingMessages_response) {
    return _resolveAwaitingResponseMessagePromise(
      extractIdOfMessage,
      nameOfMalformedMessageListener,
      responsiveWebSocket,
      incomingMessage
    );
  }
  else if (typeOfMessage === typesOfIncomingMessages_unrequestingMessage) {
    return _emitUnrequestingMessageEvent(
      nameOfUnrequestingMessageEventListener,
      startIndexOfBodyInUnrequestingMessage,
      responsiveWebSocket,
      incomingMessage
    );
  }
  else if (typeOfMessage === typesOfIncomingMessages_request) {
    return _emitAwaitingResponseMessageEvent(
      extractIdOfMessage,
      nameOfRequestEventListener,
      SenderOfResponse,
      startIndexOfBodyInRequest,
      nameOfMalformedMessageListener,
      responsiveWebSocket,
      incomingMessage
    );
  }
};

const _resolveAwaitingResponseMessagePromise = function(
  extractIdOfMessage,
  nameOfMalformedMessageListener,
  responsiveWebSocket,
  rawPayload
) {
  let numOfMessage;
  try {
    numOfMessage = extractIdOfMessage(rawPayload);
  } catch(error) {
    _emitMalformedMessageEvent(responsiveWebSocket, nameOfMalformedMessageListener, rawPayload);
    return;
  }
  const table = responsiveWebSocket[_idOfRequestToPromise];
  const awaitingPromise = table.get(numOfMessage);

  if (awaitingPromise) {
    clearTimeout(awaitingPromise[entryAboutPromiseOfRequest_nameOfTimeout]);
    table.delete(numOfMessage);
    awaitingPromise[entryAboutPromiseOfRequest_nameOfPromiseResolver](rawPayload);
  }
};

const _emitUnrequestingMessageEvent = function(
  nameOfUnrequestingMessageEventListener,
  startIndexOfBodyInUnrequestingMessage,
  responsiveWebSocket,
  rawPayload
) {
  // listener by default is empty fn, responsiveWebSocket prohibit to set other than fn
  responsiveWebSocket[nameOfUnrequestingMessageEventListener](rawPayload, startIndexOfBodyInUnrequestingMessage);
};

const _emitAwaitingResponseMessageEvent = function(
  extractIdOfMessage,
  nameOfRequestEventListener,
  SenderOfResponse,
  startIndexOfBodyInRequest,
  nameOfMalformedMessageListener,
  responsiveWebSocket,
  rawPayload
) {
  let numOfMessage;
  try {
    numOfMessage = extractIdOfMessage(rawPayload);
  } catch(error) {
    _emitMalformedMessageEvent(responsiveWebSocket, nameOfMalformedMessageListener, rawPayload);
    return;
  }

  const senderOfResponse = new SenderOfResponse(responsiveWebSocket[_connection], numOfMessage);
  // listener by default is empty fn, responsiveWebSocket prohibit to set other than fn
  responsiveWebSocket[nameOfRequestEventListener](
    rawPayload,
    startIndexOfBodyInRequest,
    senderOfResponse
  );
};

const _emitMalformedMessageEvent = function(responsiveWebSocket, nameOfMalformedMessageListener, incomingMessage) {
  if (responsiveWebSocket[nameOfMalformedMessageListener]) {
    responsiveWebSocket[nameOfMalformedMessageListener](incomingMessage);
  }
};

module.exports = acceptMessageFromInnerWebSocket;
