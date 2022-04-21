"use strict";

const expectTrue = require("assert").ok;

const createFnToCheckSendingFragmentsOfResponse = function(
  request,
  sendRequest,
  setListenerOfRequest,
  fragmentsOfResponse,
  sendFramentsOfResponse,
  fullResponse,
  areMessagesEqual,
  getStartIndexOfBodyInResponse
) {
  return checkSendingFragmentsOfResponse.bind(
    null,
    request,
    sendRequest,
    setListenerOfRequest,
    fragmentsOfResponse,
    sendFramentsOfResponse,
    fullResponse,
    areMessagesEqual,
    getStartIndexOfBodyInResponse
  );
};

const checkSendingFragmentsOfResponse = async function(
  request,
  sendRequest,
  setListenerOfRequest,
  fragmentsOfResponse,
  sendFramentsOfResponse,
  fullResponse,
  areMessagesEqual,
  getStartIndexOfBodyInResponse,
  sender,
  receiver
) {
  setListenerOfRequest(receiver, function(messageWithHeader, startIndex, senderOfResponse) {
    return sendFramentsOfResponse(senderOfResponse, fragmentsOfResponse);
  });
  const {message: response} = await sendRequest(sender, request);
  const startIndex = getStartIndexOfBodyInResponse(sender);
  expectTrue(areMessagesEqual(fullResponse, startIndex, response));
};

module.exports = createFnToCheckSendingFragmentsOfResponse;
