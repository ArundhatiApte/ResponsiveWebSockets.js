"use strict";

const {
  request: typesOfIncomingMessages_request,
  response: typesOfIncomingMessages_response,
  unrequestingMessage: typesOfIncomingMessages_unrequestingMessage,
} = require("./../../../common/messaging/typesOfIncomingMessages");

const ErrorAtParsing = require("./../../../common/messaging/ErrorAtParsing");

const {
  _connection,
  _idOfRequestToPromise
} = require("./../ResponsiveConnection")._namesOfPrivateProperties;

const {
  create: entryAboutPromiseOfRequest_create,
  nameOfPromiseResolver: entryAboutPromiseOfRequest_nameOfPromiseResolver,
  nameOfTimeout: entryAboutPromiseOfRequest_nameOfTimeout
} = require("./entryAboutPromiseOfRequest");

const listenEventOfMessageToInnerWebSocket = function(
  extractTypeOfIncomingMessage,
  extractIdOfMessage,
  typeOfMessageContent,

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
      typeOfMessageContent,
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
  typeOfMessageContent,
  nameOfMalformedMessageListener,
  responsiveWebSocket,
  rawPayload
) {
  const table = responsiveWebSocket[_idOfRequestToPromise];
  let numOfMessage;
  try {
    numOfMessage = extractIdOfMessage(rawPayload);
  } catch(error) {
    _emitMalformedMessageEvent(responsiveWebSocket, nameOfMalformedMessageListener, rawPayload);
    return;
  }
  const awaitingPromise = table.get(numOfMessage);

  if (awaitingPromise) {
    clearTimeout(awaitingPromise[entryAboutPromiseOfRequest_nameOfTimeout]);
    const dataForCallback = {
      contentType: typeOfMessageContent,
      message: rawPayload
    };

    table.delete(numOfMessage);
    awaitingPromise[entryAboutPromiseOfRequest_nameOfPromiseResolver](dataForCallback);
  }
};

const _emitUnrequestingMessageEvent = function(
  nameOfUnrequestingMessageEventListener,
  startIndexOfBodyInUnrequestingMessage,
  responsiveWebSocket,
  rawPayload
) {
  if (responsiveWebSocket[nameOfUnrequestingMessageEventListener]) {
    responsiveWebSocket[nameOfUnrequestingMessageEventListener](rawPayload, startIndexOfBodyInUnrequestingMessage);
  }
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
  if (responsiveWebSocket[nameOfRequestEventListener]) {
    let numOfMessage;
    try {
      numOfMessage = extractIdOfMessage(rawPayload);
    } catch(error) {
      _emitMalformedMessageEvent(responsiveWebSocket, nameOfMalformedMessageListener, rawPayload);
      return;
    }

    const senderOfResponse = new SenderOfResponse(responsiveWebSocket[_connection], numOfMessage);
    responsiveWebSocket[nameOfRequestEventListener](
      rawPayload,
      startIndexOfBodyInRequest,
      senderOfResponse
    );
  }
};

const _emitMalformedMessageEvent = function(responsiveWebSocket, nameOfMalformedMessageListener, incomingMessage) {
  if (responsiveWebSocket[nameOfMalformedMessageListener]) {
    responsiveWebSocket[nameOfMalformedMessageListener](incomingMessage);
  }
};

module.exports = listenEventOfMessageToInnerWebSocket;
