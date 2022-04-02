"use strict";

const { TimeoutToReceiveResponseException } = require("./../ResponsiveConnection");

const createTimeoutToReceiveResponse = function(
  idOfRequestToEntryAboutPromise,
  idOfMessage,
  rejectPromise,
  maxTimeMsToWaitResponse
) {
  return setTimeout(
    _deleteEntryAndRejectResponsePromise,
    maxTimeMsToWaitResponse,
    idOfRequestToEntryAboutPromise,
    idOfMessage,
    rejectPromise
  );
};

const _deleteEntryAndRejectResponsePromise = function(idOfRequestToEntryAboutPromise, idOfMessage, rejectPromise) {
  idOfRequestToEntryAboutPromise.delete(idOfMessage);
  rejectPromise(new TimeoutToReceiveResponseException(
    "ResponsiveWebSocketConnection:: timeout for receiving response."));
};

module.exports = createTimeoutToReceiveResponse;
