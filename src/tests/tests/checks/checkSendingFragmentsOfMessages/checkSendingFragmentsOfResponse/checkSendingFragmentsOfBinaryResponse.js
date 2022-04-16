"use strict";

const createByteArray = require("./../utils/createByteArray");
const areByteArraysEqual = require("./../utils/areByteArraysEqual/areByteArraysEqual");

const createFnToCheckSendingFragmentsOfResponse = require("./_createFnToCheckSendingFragmentsOfResponse");

const request = createByteArray([1, 2, 9, 99]);
const sendRequest = (sender, request) => sender.sendBinaryRequest(request);
const setListenerOfRequest = (receiver, listener) => receiver.setBinaryRequestListener(listener);

const fragmentsOfResponse = [
  createByteArray([1, 2, 3, 4, 5, 6, 7, 8]),
  createByteArray([9, 10, 11, 12, 13, 14]),
  createByteArray([15, 16, 17, 18]),
  createByteArray([19, 20]),
];

const sendFramentsOfResponse = (senderOfResponse, fragments) => (
  senderOfResponse.sendFragmentsOfBinaryResponse.apply(senderOfResponse, fragments)
);

const fullResponse = createByteArray([
  1, 2, 3, 4, 5, 6, 7, 8,
  9, 10, 11, 12, 13, 14,
  15, 16, 17, 18,
  19, 20
]);

const getStartIndexOfBodyInResponse = (sender) => sender.startIndexOfBodyInBinaryResponse;

module.exports = createFnToCheckSendingFragmentsOfResponse(
  request,
  sendRequest,
  setListenerOfRequest,
  fragmentsOfResponse,
  sendFramentsOfResponse,
  fullResponse,
  areByteArraysEqual,
  getStartIndexOfBodyInResponse
);
