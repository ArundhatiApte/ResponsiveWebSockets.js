"use strict";

const expectTrue = require("assert").ok;

const createFnToCheckSendingFragmentsOfRequest = function(
  fragmentsOfRequest,
  sendFragmentsOfRequest,
  fullRequest,
  areMessagesEqual,
  setListenerOfRequest,
  fullResponse,
  sendResponse
) {
  return _checkSendingFragmentsOfRequest.bind(
    null,
    fragmentsOfRequest,
    sendFragmentsOfRequest,
    fullRequest,
    areMessagesEqual,
    setListenerOfRequest,
    fullResponse,
    sendResponse
  );
};

const _checkSendingFragmentsOfRequest = async function(
  fragmentsOfRequest,
  sendFragmentsOfRequest,
  fullRequest,
  areMessagesEqual,
  setListenerOfRequest,
  fullResponse,
  sendResponse,
  sender,
  receiver
) {
  let areRequestsEqual;
  setListenerOfRequest(receiver, function(messageWithHeader, startIndex, senderOfResponse) {
    areRequestsEqual = areMessagesEqual(fullRequest, startIndex, messageWithHeader);
    sendResponse(senderOfResponse, fullResponse);
  });
  const {message: response} = await sendFragmentsOfRequest(sender, fragmentsOfRequest);
  expectTrue(areRequestsEqual);
};

module.exports = createFnToCheckSendingFragmentsOfRequest;
