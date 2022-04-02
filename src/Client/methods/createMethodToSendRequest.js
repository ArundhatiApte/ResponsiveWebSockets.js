"use strict";

const {
  _connection,
  _maxTimeMsToWaitResponse,
  _generatorOfRequestId,
  _idOfRequestToPromise,
} = require("./../../common/ResponsiveConnection/ResponsiveConnection")._namesOfPrivateProperties;

const createTimeoutToReceiveResponse = require(
  "./../../common/ResponsiveConnection/utils/createTimeoutToReceiveResponse"
);

const {
  create: createEntryAboutPromiseOfRequest
} = require("./../../common/ResponsiveConnection/utils/entryAboutPromiseOfRequest");

const createMethodToSendRequest = function(createRequestMessage) {
  return function sendRequest(message, maxTimeMsToWaitResponse) {
    return new Promise((resolve, reject) => {
      if (!maxTimeMsToWaitResponse) {
        maxTimeMsToWaitResponse = this[_maxTimeMsToWaitResponse];
      }
      
      const idOfMessage = this[_generatorOfRequestId].getNext();
      const idOfRequestToPromise = this[_idOfRequestToPromise];

      const timeoutToReject = createTimeoutToReceiveResponse(
        idOfRequestToPromise,
        idOfMessage,
        reject,
        maxTimeMsToWaitResponse
      );
      
      const entryAboutPromise = createEntryAboutPromiseOfRequest(resolve, timeoutToReject);
      idOfRequestToPromise.set(idOfMessage, entryAboutPromise);
      const messageWithHeader = createRequestMessage(idOfMessage, message);
      this[_connection].send(messageWithHeader);
    });
  };
};

module.exports = createMethodToSendRequest;
