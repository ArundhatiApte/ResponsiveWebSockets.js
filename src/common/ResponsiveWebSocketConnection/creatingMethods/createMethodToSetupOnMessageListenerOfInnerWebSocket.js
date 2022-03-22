"use strict";

const {
  ExceptionAtParsing,
  typesOfIncomingMessages: {
    response: typesOfIncomingMessages_response,
    incomingWithoutWaitingResponse: typesOfIncomingMessages_incomingWithoutWaitingResponse,
    incomingAwaitingResponse: typesOfIncomingMessages_incomingAwaitingResponse 
  }
} = require("./../modules/messaging/messaging");

const SenderOfResponse = require("./../modules/SenderOfResponse");

const {
  _connection,
  _idOfAwaitingResponseMessageToPromise
} = require("./../ResponsiveWebSocketConnection")._namesOfPrivateProperties;

const {
  nameOfTimeout: entryAboutPromiseOfRequest_nameOfTimeout,
  nameOfPromiseResolver: entryAboutPromiseOfRequest_nameOfPromiseResolver
} = require("./entryAboutPromiseOfRequest");

const createMethodToSetupOnMessageListenerOfInnerWebSocket = function(
  extractTypeOfIncomingMessage,
  extractIdOfMessage,
  typeOfMessageContent,
  
  nameOfUnrequestingMessageEventListener,
  startIndexOfUnrequestingMessageBody,
  
  nameOfAwaitingResponseMessageEventListener,
  startIndexOfAwaitingResponseMessageBody
) {

  const _emitEventByIncomingMessage = function(message) {
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
      return _resolveAwaitingResponseMessagePromise.call(this, message);  
    }
    else if (typeOfMessage === typesOfIncomingMessages_incomingWithoutWaitingResponse) {
      return _emitUnrequestingMessageEvent.call(this, message);
    }
    else if (typeOfMessage === typesOfIncomingMessages_incomingAwaitingResponse) {
      return _emitAwaitingResponseMessageEvent.call(this, message); 
    }
  };

  const _resolveAwaitingResponseMessagePromise = function(rawPayload) {
    const table = this[_idOfAwaitingResponseMessageToPromise],
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

  const _emitUnrequestingMessageEvent = function(rawPayload) {
    if (this[nameOfUnrequestingMessageEventListener]) {
      this[nameOfUnrequestingMessageEventListener](rawPayload, startIndexOfUnrequestingMessageBody);
    }
  };
  
  const _emitAwaitingResponseMessageEvent = function(rawPayload) {
    if (this[nameOfAwaitingResponseMessageEventListener]) {
      const numOfMessage = extractIdOfMessage(rawPayload);
      const senderOfResponse = _createSenderOfMessageResponse(this, numOfMessage);
      
      this[nameOfAwaitingResponseMessageEventListener](
        rawPayload, startIndexOfAwaitingResponseMessageBody, senderOfResponse
      );
    }
  };

  return _emitEventByIncomingMessage;
};

const _createSenderOfMessageResponse = function(responsiveWebSocketConnection, idOfMessage) {
  return new SenderOfResponse(responsiveWebSocketConnection[_connection], idOfMessage);
};

module.exports = createMethodToSetupOnMessageListenerOfInnerWebSocket; 
