"use strict";

const expectTrue = require("assert").ok;

const createFnToCheckSendingFragmentsOfResponse = function(
  sendRequest,
  setListenerOfRequest,
  fragmentsOfResponse,
  sendFramentsOfResponse,
  fullResponse,
  areMessagesEqual,
  nameOfPropertyWithStartIndexOfBodyInResponse
) {
  return checkSendingFragmentsOfResponse.bind(
    null,
    sendRequest,
    setListenerOfRequest,
    fragmentsOfResponse,
    sendFramentsOfResponse,
    fullResponse,
    areMessagesEqual,
    nameOfPropertyWithStartIndexOfBodyInResponse
  );
};

const checkSendingFragmentsOfResponse = async function(
  sendRequest,
  setListenerOfRequest,
  fragmentsOfResponse,
  sendFramentsOfResponse,
  fullResponse,
  areMessagesEqual,
  nameOfPropertyWithStartIndexOfBodyInResponse,
  sender,
  receiver
) {
  setListenerOfRequest(receiver, function(messageWithHeader, startIndex, senderOfResponse) {
    return sendFramentsOfResponse(senderOfResponse, fragmentsOfResponse);
  });
  const response = await sendRequest(sender);
  const startIndex = sender[nameOfPropertyWithStartIndexOfBodyInResponse];
  expectTrue(areMessagesEqual(fullResponse, 0, response, startIndex));
};

module.exports = createFnToCheckSendingFragmentsOfResponse;
