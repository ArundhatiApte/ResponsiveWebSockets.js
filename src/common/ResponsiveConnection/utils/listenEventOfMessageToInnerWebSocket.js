"use strict";

const {
  request: typesOfIncomingMessages_request,
  response: typesOfIncomingMessages_response,
  unrequestingMessage: typesOfIncomingMessages_unrequestingMessage,
} = require("./../../../common/messaging/typesOfIncomingMessages");

const ExceptionAtParsing = require("./../../../common/messaging/ExceptionAtParsing");

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

  responsiveWebSocket,
  incomingMessage
) {
  let typeOfMessage;
  try {
    typeOfMessage = extractTypeOfIncomingMessage(incomingMessage);
  } catch(error) {
    if (error instanceof ExceptionAtParsing) {
      return;
    }
    throw error;
  }
  
  if (typeOfMessage === typesOfIncomingMessages_response) {
    return _resolveAwaitingResponseMessagePromise(
      extractIdOfMessage,
      typeOfMessageContent,
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
      responsiveWebSocket,
      incomingMessage
    ); 
  }
};

const _resolveAwaitingResponseMessagePromise = function(
  extractIdOfMessage,
  typeOfMessageContent,
  responsiveWebSocket,
  rawPayload
) {
  const table = responsiveWebSocket[_idOfRequestToPromise],
        numOfMessage = extractIdOfMessage(rawPayload),
        awaitingPromise = table.get(numOfMessage);
  
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
  responsiveWebSocket,
  rawPayload
) {
  if (responsiveWebSocket[nameOfRequestEventListener]) {
    const numOfMessage = extractIdOfMessage(rawPayload);
    const senderOfResponse = new SenderOfResponse(responsiveWebSocket[_connection], numOfMessage);
    
    responsiveWebSocket[nameOfRequestEventListener](
      rawPayload,
      startIndexOfBodyInRequest,
      senderOfResponse
    );
  }
};

module.exports = listenEventOfMessageToInnerWebSocket;
