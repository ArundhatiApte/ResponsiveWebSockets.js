"use strict";

const areStringsEqual = require("./../utils/areStringsEqual");
const createFnToCheckSendingFragmentsOfResponse = require("./_createFnToCheckSendingFragmentsOfResponse");

const request = "get baz";
const sendRequest = (sender, request) => sender.sendTextRequest(request);
const setListenerOfRequest = (receiver, listener) => receiver.setTextRequestListener(listener);

const fragmentsOfResponse = [
  "fragments ", "of ", "response"
];

const fullResponse = fragmentsOfResponse.join("");
const sendFramentsOfResponse = (senderOfResponse, fragments) => (
  senderOfResponse.sendFragmentsOfTextResponse.apply(senderOfResponse, fragments)
);
const getStartIndexOfBodyInResponse = (sender) => sender.startIndexOfBodyInTextResponse;

module.exports = createFnToCheckSendingFragmentsOfResponse(
  request,
  sendRequest,
  setListenerOfRequest,
  fragmentsOfResponse,
  sendFramentsOfResponse,
  fullResponse,
  areStringsEqual,
  getStartIndexOfBodyInResponse
);
