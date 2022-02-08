"use strict";

const {
  response: typesOfIncomingMessages_response,
  incomingWithoutWaitingResponse: typesOfIncomingMessages_incomingWithoutWaitingResponse,
  incomingAwaitingResponse: typesOfIncomingMessages_incomingAwaitingResponse 
} = require("./../modules/messaging/messaging").typesOfIncomingMessages;

const SenderOfResponse = require("./../modules/SenderOfResponse");

const {
  _connection,
  _idOfAwaitingResponseMessageToPromise
} = require("./../ResponsiveWebSocketConnection")._namesOfPrivateProperties;

const {
  nameOfTimeout: entryAboutAwaitingPromise_nameOfTimeout,
  nameOfPromiseResolver: entryAboutAwaitingPromise_nameOfPromiseResolver
} = require("./entryAboutAwaitingPromise");

const createMethodToSetupOnMessageListenerOfInnerWebSocket = function(
  parseMessage,
  typeOfMessageContent,
  
  nameOfUnrequestingMessageEventListener,
  startIndexOfUnrequestingMessageBody,
  
  nameOfAwaitingResponseMessageEventListener,
  startIndexOfAwaitingResponseMessageBody,

  startIndexOfResponseMessageBody
) {

  const _emitEventByIncomingMessage = function(message) {
    let infoAboutMessage;
    try {
      infoAboutMessage = parseMessage(message);
    } catch(error) {
      if (error instanceof ExeptionAtParsing) {
        return;
      }
      throw error;
    }
    const type = infoAboutMessage.type;
    
    if (type === typesOfIncomingMessages_response) {
      return _resolveAwaitingResponseMessagePromise.call(this, infoAboutMessage, message);  
    }
    else if (type === typesOfIncomingMessages_incomingWithoutWaitingResponse) {
      return _emitUnrequestingMessageEvent.call(this, infoAboutMessage, message);
    }
    else if (type === typesOfIncomingMessages_incomingAwaitingResponse) {
      return _emitAwaitingResponseMessageEvent.call(this, infoAboutMessage, message); 
    }
  };

  const _resolveAwaitingResponseMessagePromise = function(infoAboutMessage, rawPayload) {
    const table = this[_idOfAwaitingResponseMessageToPromise],
          numOfMessage = infoAboutMessage.idOfMessage,
          awaitingPromise = table.get(numOfMessage);
    
    if (!awaitingPromise) {
      return;
    }
    clearTimeout(awaitingPromise[entryAboutAwaitingPromise_nameOfTimeout]);
    const dataForCallback = {
      contentType: typeOfMessageContent,
      startIndex: startIndexOfResponseMessageBody,
      message: rawPayload
    };

    table.delete(numOfMessage);
    awaitingPromise[entryAboutAwaitingPromise_nameOfPromiseResolver](dataForCallback);
  };

  const _emitUnrequestingMessageEvent = function(infoAboutMessage, rawPayload) {
    if (this[nameOfUnrequestingMessageEventListener]) {
      this[nameOfUnrequestingMessageEventListener](rawPayload, startIndexOfUnrequestingMessageBody);
    }
  };
  
  const _emitAwaitingResponseMessageEvent = function(infoAboutMessage, rawPayload) {
    if (this[nameOfAwaitingResponseMessageEventListener]) {
      const senderOfResponse = _createSenderOfMessageResponse(this, infoAboutMessage.idOfMessage);
      
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
