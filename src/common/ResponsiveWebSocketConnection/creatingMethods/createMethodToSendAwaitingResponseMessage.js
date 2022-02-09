"use strict";

const {
  _maxTimeMSToWaitResponse,
  _genOfAwaitingResponseMessageId,
  _idOfAwaitingResponseMessageToPromise,
  _connection
} = require("./../ResponsiveWebSocketConnection")._namesOfPrivateProperties;

const {
  create: entryAboutPromiseOfRequest_create
} = require("./entryAboutPromiseOfRequest");

const createMethodToSendAwaitingResponseMessage = function(
  createAwaitingResponseMessage, nameOfSendingMessageMethod
) {
  return function sendAwaitingResponseMessage(message, maxTimeMSToWaitResponse) {
    return new Promise((resolve, reject) => {
      if (!maxTimeMSToWaitResponse) {
        maxTimeMSToWaitResponse = this[_maxTimeMSToWaitResponse];
      }
      const idOfMessage = this[_genOfAwaitingResponseMessageId].getNext();
      const timeoutToReject = this._createTimeoutToReceiveResponse(
        idOfMessage, reject, maxTimeMSToWaitResponse
      );
      
      const entryAboutPromise = entryAboutPromiseOfRequest_create(resolve, timeoutToReject);
      this[_idOfAwaitingResponseMessageToPromise].set(idOfMessage, entryAboutPromise);
      const messageWithHeader = createAwaitingResponseMessage(idOfMessage, message);
      this[_connection][nameOfSendingMessageMethod](messageWithHeader);
    });
  };
};

module.exports = createMethodToSendAwaitingResponseMessage;
