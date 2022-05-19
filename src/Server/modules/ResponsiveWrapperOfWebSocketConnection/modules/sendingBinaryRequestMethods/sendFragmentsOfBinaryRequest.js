"use strict";

const {
  _namesOfPrivateProperties: {
    _connection,
    _getNextIdOfRequest,
    _idOfRequestToPromise,
    _maxTimeMsToWaitResponse,
  }
} = require("./../../../../../common/ResponsiveWebSocketConnection/ResponsiveWebSocketConnection");

const createTimeoutToReceiveResponse = require(
  "./../../../../../common/ResponsiveWebSocketConnection/utils/createTimeoutToReceiveResponse"
);
const createEntryAboutPromiseOfRequest = require(
  "./../../../../../common/ResponsiveWebSocketConnection/utils/entryAboutPromiseOfRequest"
).create;

const {
  fillHeaderAsRequest: fillArrayBufferAsHeaderOfBinaryRequest
} = require("./../../../../../common/ResponsiveWebSocketConnection/modules/messaging/binaryMessages/binaryMessager");

const { _bufferForHeaderOfRequestOrResponse } = require("./../../ResponsiveWrapperOfWebSocketConnection");
const sendHeaderAndFragments = require("./../utilsForWebSocket/sendHeaderAndFragments");

const sendFragmentsOfBinaryRequest = function() {
  return new Promise((resolve, reject) => {
    const idOfRequest = this[_getNextIdOfRequest]();
    const idOfRequestToPromise = this[_idOfRequestToPromise];
    const timeout = createTimeoutToReceiveResponse(
      idOfRequestToPromise,
      idOfRequest,
      reject,
      this[_maxTimeMsToWaitResponse]
    );

    const entryAboutPromise = createEntryAboutPromiseOfRequest(resolve, timeout);
    idOfRequestToPromise.set(idOfRequest, entryAboutPromise);

    fillArrayBufferAsHeaderOfBinaryRequest(idOfRequest, _bufferForHeaderOfRequestOrResponse);
    sendHeaderAndFragments(this[_connection], _bufferForHeaderOfRequestOrResponse, true, arguments);
  });
};

module.exports = sendFragmentsOfBinaryRequest;
