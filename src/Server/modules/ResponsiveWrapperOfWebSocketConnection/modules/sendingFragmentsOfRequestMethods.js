"use strict";

const {
  _connection,
  _generatorOfRequestId,
  _idOfRequestToPromise,
  _maxTimeMsToWaitResponse,
} = require("./../../../../common/ResponsiveConnection/ResponsiveConnection")._namesOfPrivateProperties;

const createTimeoutToReceiveResponse = require(
  "./../../../../common/ResponsiveConnection/utils/createTimeoutToReceiveResponse"
);
const createEntryAboutPromiseOfRequest = require(
  "./../../../../common/ResponsiveConnection/utils/entryAboutPromiseOfRequest"
).create;

const {
  binaryMessager: {
    createHeaderOfRequest: createHeaderOfBinaryRequest
  },
  textMessager: {
    createHeaderOfRequest: createHeaderOfTextRequest
  }
} = require("./messaging/messaging");

const sendHeaderAndFragments = require("./sendHeaderAndFragments");

const sendFragmentsOfRequest = function(
  responsiveConnection,
  createHeaderOfRequest,
  isMessageBinary,
  fragments
) {
  return new Promise((resolve, reject) => {
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

    const header = createHeaderOfRequest(idOfRequest);
    sendHeaderAndFragments(responsiveConnection[_connection], isMessageBinary, header, fragments);
  });
};

const sendFragmentsOfBinaryRequest = function() {
  return sendFragmentsOfRequest(
    this,
    createHeaderOfBinaryRequest,
    true,
    arguments
  );
};

const sendFragmentsOfTextRequest = function() {
  return sendFragmentsOfRequest(
    this,
    createHeaderOfTextRequest,
    false,
    arguments
  );
};

module.exports = {
  sendFragmentsOfBinaryRequest,
  sendFragmentsOfTextRequest
};
