"use strict";

const {
  TimeoutToReceiveResponseExeption,
  _namesOfPrivateProperties: {
    _maxTimeMSToWaitResponse,
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
  return function sendAwaitingResponseMessage(message, maxTimeMSToWaitResponse) {
    return new Promise((resolve, reject) => {
      if (!maxTimeMSToWaitResponse) {
        maxTimeMSToWaitResponse = this[_maxTimeMSToWaitResponse];
      }
      const idOfMessage = this[_genOfAwaitingResponseMessageId].getNext();
      const timeoutToReject = _createTimeoutToReceiveResponse(
        this, idOfMessage, reject, maxTimeMSToWaitResponse
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
  maxTimeMSToWaitResponse
) {
  return setTimeout(
    _deleteEntryAndRejectResponsePromise,
    maxTimeMSToWaitResponse,
    responsiveConnection,
    idOfMessage,
    rejectPromise
  );
};

const _deleteEntryAndRejectResponsePromise = function(responsiveConnection, idOfMessage, rejectPromise) {
  responsiveConnection[_idOfAwaitingResponseMessageToPromise].delete(idOfMessage);
  rejectPromise(new TimeoutToReceiveResponseExeption(
    "ResponsiveWebSocketConnection:: timeout for receiving response."));
};

module.exports = createMethodToSendAwaitingResponseMessage;
