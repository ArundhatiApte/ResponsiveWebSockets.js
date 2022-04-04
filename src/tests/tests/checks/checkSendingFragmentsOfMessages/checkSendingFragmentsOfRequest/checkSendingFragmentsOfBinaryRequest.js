"use strict";

const createByteArray = require("./../utils/createByteArray");
const areByteArraysEqual = require("./../utils/areByteArraysEqual/areByteArraysEqual");

const createFnToCheckSendingFragmentsOfRequest = require("./createFnToCheckSendingFragmentsOfRequest");

const fragmentsOfRequest = [
  createByteArray([1, 1, 1, 1]),
  createByteArray([2, 2, 2, 2]),
  createByteArray([3, 3, 3, 3]),
  createByteArray([4, 4, 4, 4])
];
const sendFragmentsOfRequest = function(sender, fragments) {
  return sender.sendFragmentsOfBinaryRequest.apply(sender, fragments);
};

const fullRequest = createByteArray([
  1, 1, 1, 1,
  2, 2, 2, 2,
  3, 3, 3, 3,
  4, 4, 4, 4
]);

const setListenerOfRequest = function(receiver, listener) {
  return receiver.setBinaryRequestListener(listener);
};

const fullResponse = createByteArray([1, 2, 3, 4]);

const sendResponse = function(senderOfResponse, response) {
  return senderOfResponse.sendBinaryResponse(response);
};

module.exports = createFnToCheckSendingFragmentsOfRequest(
  fragmentsOfRequest,
  sendFragmentsOfRequest,
  fullRequest,
  areByteArraysEqual,
  setListenerOfRequest,
  fullResponse,
  sendResponse
);
