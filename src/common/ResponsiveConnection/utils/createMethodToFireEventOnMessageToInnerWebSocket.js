"use strict";

const {
  request: typesOfIncomingMessages_request,
  response: typesOfIncomingMessages_response,
  unrequestingMessage: typesOfIncomingMessages_unrequestingMessage,
} = require("./../../../common/messaging/typesOfIncomingMessages");

const ExceptionAtParsing = require("./../../../common/messaging/ExceptionAtParsing");

const {
  create: entryAboutPromiseOfRequest_create,
  nameOfPromiseResolver: entryAboutPromiseOfRequest_nameOfPromiseResolver,
  nameOfTimeout: entryAboutPromiseOfRequest_nameOfTimeout
} = require("./entryAboutPromiseOfRequest");

const createMethodToFireEventOnMessageToInnerWebSocket = function(
  _idOfRequestToPromise,
  
  extractTypeOfIncomingMessage,
  extractIdOfMessage,
  typeOfMessageContent,
  
  nameOfUnrequestingMessageEventListener,
  startIndexOfBodyInUnrequestingMessage,
  
  nameOfRequestEventListener,
  startIndexOfBodyInRequest,
  createSenderOfMessageResponse
) {

  const _emitEventByIncomingMessage = function(responsiveWebSocket, message) {
    let typeOfMessage;
    try {
      typeOfMessage = extractTypeOfIncomingMessage(message);
    } catch(error) {
      if (error instanceof ExceptionAtParsing) {
        return;
      }
      throw error;
    }
    
    if (typeOfMessage === typesOfIncomingMessages_response) {
      return _resolveAwaitingResponseMessagePromise(responsiveWebSocket, message);  
    }
    else if (typeOfMessage === typesOfIncomingMessages_unrequestingMessage) {
      return _emitUnrequestingMessageEvent(responsiveWebSocket, message);
    }
    else if (typeOfMessage === typesOfIncomingMessages_request) {
      return _emitAwaitingResponseMessageEvent(responsiveWebSocket, message); 
    }
  };

  const _resolveAwaitingResponseMessagePromise = function(responsiveWebSocket, rawPayload) {
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

  const _emitUnrequestingMessageEvent = function(responsiveWebSocket, rawPayload) {
    if (responsiveWebSocket[nameOfUnrequestingMessageEventListener]) {
      responsiveWebSocket[nameOfUnrequestingMessageEventListener](rawPayload, startIndexOfBodyInUnrequestingMessage);
    }
  };
  
  const _emitAwaitingResponseMessageEvent = function(responsiveWebSocket, rawPayload) {
    if (responsiveWebSocket[nameOfRequestEventListener]) {
      const numOfMessage = extractIdOfMessage(rawPayload);
      const senderOfResponse = createSenderOfMessageResponse(responsiveWebSocket, numOfMessage);
      
      responsiveWebSocket[nameOfRequestEventListener](
        rawPayload, startIndexOfBodyInRequest, senderOfResponse
      );
    }
  };

  return _emitEventByIncomingMessage;
};

module.exports = createMethodToFireEventOnMessageToInnerWebSocket;
