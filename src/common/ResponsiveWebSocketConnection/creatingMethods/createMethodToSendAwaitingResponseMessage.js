"use strict";

const {
  TimeoutToReceiveResponseException,
  _namesOfPrivateProperties: {
    _maxTimeMsToWaitResponse,
    _genOfAwaitingResponseMessageId,
    _idOfAwaitingResponseMessageToPromise,
    _connection
  }
} = require("./../ResponsiveWebSocketConnection");

const {
  create: entryAboutPromiseOfRequest_create
} = require("./entryAboutPromiseOfRequest");

const createMethodToSendAwaitingResponseMessage = function(
  createAwaitingResponseMessage, nameOfSendingMessageMethod
) {
  return function sendAwaitingResponseMessage(message, maxTimeMsToWaitResponse) {
    return new Promise((resolve, reject) => {
      if (!maxTimeMsToWaitResponse) {
        maxTimeMsToWaitResponse = this[_maxTimeMsToWaitResponse];
      }
      const idOfMessage = this[_genOfAwaitingResponseMessageId].getNext();
      const timeoutToReject = _createTimeoutToReceiveResponse(
        this, idOfMessage, reject, maxTimeMsToWaitResponse
      );
      
      const entryAboutPromise = entryAboutPromiseOfRequest_create(resolve, timeoutToReject);
      this[_idOfAwaitingResponseMessageToPromise].set(idOfMessage, entryAboutPromise);
      const messageWithHeader = createAwaitingResponseMessage(idOfMessage, message);
      this[_connection][nameOfSendingMessageMethod](messageWithHeader);
    });
  };
};

const _createTimeoutToReceiveResponse = function(
  responsiveConnection,
  idOfMessage,
  rejectPromise,
  maxTimeMsToWaitResponse
) {
  return setTimeout(
    _deleteEntryAndRejectResponsePromise,
    maxTimeMsToWaitResponse,
    responsiveConnection,
    idOfMessage,
    rejectPromise
  );
};

const _deleteEntryAndRejectResponsePromise = function(responsiveConnection, idOfMessage, rejectPromise) {
  responsiveConnection[_idOfAwaitingResponseMessageToPromise].delete(idOfMessage);
  rejectPromise(new TimeoutToReceiveResponseException(
    "ResponsiveWebSocketConnection:: timeout for receiving response."));
};

module.exports = createMethodToSendAwaitingResponseMessage;
