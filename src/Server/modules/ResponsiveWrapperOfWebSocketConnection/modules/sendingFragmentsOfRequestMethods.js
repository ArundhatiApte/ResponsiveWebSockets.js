"use strict";

const {
  _namesOfPrivateProperties: {
    _connection,
    _generatorOfRequestId,
    _idOfRequestToPromise,
    _maxTimeMsToWaitResponse,
  }
} = require("./../../../../common/ResponsiveWebSocketConnection/ResponsiveWebSocketConnection");

const createTimeoutToReceiveResponse = require(
  "./../../../../common/ResponsiveWebSocketConnection/utils/createTimeoutToReceiveResponse"
);
const createEntryAboutPromiseOfRequest = require(
  "./../../../../common/ResponsiveWebSocketConnection/utils/entryAboutPromiseOfRequest"
).create;

const ResponsiveWrapperOfWebSocketConnection = require("./../ResponsiveWrapperOfWebSocketConnection");
const { _symbolOfBufferForHeader } = ResponsiveWrapperOfWebSocketConnection;

const {
  binaryMessager: {
    fillBufferAsHeaderOfRequest: fillBufferAsHeaderOfBinaryRequest
  },
  textMessager: {
    fillBufferAsHeaderOfRequest: fillBufferAsHeaderOfTextRequest
  }
} = require("./messaging/messaging");

const sendHeaderAndFragments = require("./utilsForWebSocket/sendHeaderAndFragments");

const sendFragmentsOfRequest = function(
  responsiveConnection,
  fillBufferAsHeaderOfRequest,
  isMessageBinary,
  fragments
) {
  return new Promise(function(resolve, reject) {
    const idOfRequest = responsiveConnection[_generatorOfRequestId].getNext();
    const idOfRequestToPromise = responsiveConnection[_idOfRequestToPromise];
    const timeout = createTimeoutToReceiveResponse(
      idOfRequestToPromise,
      idOfRequest,
      reject,
      responsiveConnection[_maxTimeMsToWaitResponse]
    );

    const entryAboutPromise = createEntryAboutPromiseOfRequest(resolve, timeout);
    idOfRequestToPromise.set(idOfRequest, entryAboutPromise);

    const header = ResponsiveWrapperOfWebSocketConnection[_symbolOfBufferForHeader];
    fillBufferAsHeaderOfRequest(header, idOfRequest);
    sendHeaderAndFragments(responsiveConnection[_connection], header, isMessageBinary, fragments);
  });
};

const sendFragmentsOfBinaryRequest = function() {
  return sendFragmentsOfRequest(
    this,
    fillBufferAsHeaderOfBinaryRequest,
    true,
    arguments
  );
};

const sendFragmentsOfTextRequest = function() {
  return sendFragmentsOfRequest(
    this,
    fillBufferAsHeaderOfTextRequest,
    false,
    arguments
  );
};

module.exports = {
  sendFragmentsOfBinaryRequest,
  sendFragmentsOfTextRequest
};
