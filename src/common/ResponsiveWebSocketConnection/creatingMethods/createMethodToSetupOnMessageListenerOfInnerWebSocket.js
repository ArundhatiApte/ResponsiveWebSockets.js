"use strict";

const {
  response: typesOfIncomingMessages_response,
  incomingWithoutWaitingResponse: typesOfIncomingMessages_incomingWithoutWaitingResponse,
  incomingAwaitingResponse: typesOfIncomingMessages_incomingAwaitingResponse 
} = require("./../modules/messaging/messaging").typesOfIncomingMessages;

const {
  _idOfAwaitingResponseMessageToPromise
} = require("./../ResponsiveWebSocketConnection")._namesOfPrivateProperties;

const {
  nameOfTimeout: entryAboutAwaitingPromise_nameOfTimeout,
  nameOfPromiseResolver: entryAboutAwaitingPromise_nameOfPromiseResolver
} = require("./entryAboutAwaitingPromise");

const createMethodToSetupOnMessageListenerOfInnerWebSocket = function(
  parseMessage, typeOfMessageContent,
  nameOfUnrequestingMessageEventListener,
  nameOfAwaitingResponseMessageEventListener
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
      startIndex: infoAboutMessage.startIndex,
      message: rawPayload
    };

    table.delete(numOfMessage);
    awaitingPromise[entryAboutAwaitingPromise_nameOfPromiseResolver](dataForCallback);
  };

  const _emitUnrequestingMessageEvent = function(infoAboutMessage, rawPayload) {
    if (this[nameOfUnrequestingMessageEventListener]) {
      this[nameOfUnrequestingMessageEventListener](rawPayload, infoAboutMessage.startIndex);
    }
  };
  
  const _emitAwaitingResponseMessageEvent = function(infoAboutMessage, rawPayload) {
    if (this[nameOfAwaitingResponseMessageEventListener]) {
      const senderOfResponse = this._createSenderOfMessageResponse(infoAboutMessage.idOfMessage);
      
      this[nameOfAwaitingResponseMessageEventListener](
        rawPayload, infoAboutMessage.startIndex, senderOfResponse
      );
    }
  };

  return _emitEventByIncomingMessage;
};

module.exports = createMethodToSetupOnMessageListenerOfInnerWebSocket; 
