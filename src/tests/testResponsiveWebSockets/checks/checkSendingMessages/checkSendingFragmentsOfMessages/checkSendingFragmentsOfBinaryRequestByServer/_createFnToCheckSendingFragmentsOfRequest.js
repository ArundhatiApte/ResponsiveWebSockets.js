"use strict";

const expectTrue = require("assert").ok;

const createFnToCheckSendingFragmentsOfRequest = function(
  fragmentsOfRequest,
  nameOfSendingFragmentsOfRequestMethod,
  fullRequest,
  areMessagesEqual,
  nameOfSettingListenerOfRequestMethod,
  sendResponse,
  nameOfSendingResponseMethod
) {
  return _checkSendingFragmentsOfRequest.bind(
    null,
    fragmentsOfRequest,
    nameOfSendingFragmentsOfRequestMethod,
    fullRequest,
    areMessagesEqual,
    nameOfSettingListenerOfRequestMethod,
    sendResponse,
    nameOfSendingResponseMethod
  );
};

const _checkSendingFragmentsOfRequest = async function(
  fragmentsOfRequest,
  nameOfSendingFragmentsOfRequestMethod,
  fullRequest,
  areMessagesEqual,
  nameOfSettingListenerOfRequestMethod,
  sendResponse,
  nameOfSendingResponseMethod,
  sender,
  receiver
) {
  let areRequestsEqual;
  receiver[nameOfSettingListenerOfRequestMethod](function(messageWithHeader, startIndex, senderOfResponse) {
    areRequestsEqual = areMessagesEqual(fullRequest, 0, messageWithHeader, startIndex);
    sendResponse(receiver, senderOfResponse);
  });
  await sender[nameOfSendingFragmentsOfRequestMethod].apply(sender, fragmentsOfRequest);
  expectTrue(areRequestsEqual);
};

module.exports = createFnToCheckSendingFragmentsOfRequest;
