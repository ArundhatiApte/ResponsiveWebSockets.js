"use strict";

const {
  _connection,
  _generatorOfRequestId,
  _idOfRequestToPromise,
  _maxTimeMsToWaitResponse
} = require("./../../../../common/ResponsiveConnection/ResponsiveConnection")._namesOfPrivateProperties;

const {
  create: createEntryAboutPromiseOfRequest
} = require("./../../../../common/ResponsiveConnection/utils/entryAboutPromiseOfRequest");

const createTimeoutToReceiveResponse = require(
  "./../../../../common/ResponsiveConnection/utils/createTimeoutToReceiveResponse"
);

const createSendingRequestMethod = function(createHeaderOfRequest, isMessageBinary) {
  return function sendRequest(message, maxTimeMsToWaitResponse) {
    return new Promise((resolve, reject) => {
      if (!maxTimeMsToWaitResponse) {
        maxTimeMsToWaitResponse = this[_maxTimeMsToWaitResponse];
      }
      const idOfRequest = this[_generatorOfRequestId].getNext();
      const idOfRequestToPromise = this[_idOfRequestToPromise];

      const timeoutToReject = createTimeoutToReceiveResponse(
        idOfRequestToPromise,
        idOfRequest,
        reject,
        maxTimeMsToWaitResponse
      );
      
      const entryAboutPromise = createEntryAboutPromiseOfRequest(resolve, timeoutToReject);
      idOfRequestToPromise.set(idOfRequest, entryAboutPromise);
      
      const header = createHeaderOfRequest(idOfRequest);
      const connection = this[_connection];

      connection.sendFirstFragment(header, isMessageBinary);
      connection.sendLastFragment(message, isMessageBinary);
    });
  };
};

module.exports = createSendingRequestMethod;
