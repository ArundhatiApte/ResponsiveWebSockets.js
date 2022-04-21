"use strict";

const expectTrue = require("assert").ok;

const createFnToCheckSendingFragmentsOfRequest = function(
  fragmentsOfRequest,
  nameOfSendingFragmentsOfRequestMethod,
  fullRequest,
  areMessagesEqual,
  nameOfSettingListenerOfRequestMethod,
  fullResponse,
  nameOfSendingResponseMethod
) {
  return _checkSendingFragmentsOfRequest.bind(
    null,
    fragmentsOfRequest,
    nameOfSendingFragmentsOfRequestMethod,
    fullRequest,
    areMessagesEqual,
    nameOfSettingListenerOfRequestMethod,
    fullResponse,
    nameOfSendingResponseMethod
  );
};

const _checkSendingFragmentsOfRequest = async function(
  fragmentsOfRequest,
  nameOfSendingFragmentsOfRequestMethod,
  fullRequest,
  areMessagesEqual,
  nameOfSettingListenerOfRequestMethod,
  fullResponse,
  nameOfSendingResponseMethod,
  sender,
  receiver
) {
  let areRequestsEqual;
  receiver[nameOfSettingListenerOfRequestMethod](function(messageWithHeader, startIndex, senderOfResponse) {
    areRequestsEqual = areMessagesEqual(fullRequest, startIndex, messageWithHeader);
    senderOfResponse[nameOfSendingResponseMethod](fullResponse);
  });
  const {message: response} = await sender[nameOfSendingFragmentsOfRequestMethod].apply(sender, fragmentsOfRequest);
  expectTrue(areRequestsEqual);
};

module.exports = createFnToCheckSendingFragmentsOfRequest;
