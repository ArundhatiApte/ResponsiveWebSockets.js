"use strict";

const createByteArray = require("./../../utils/createArrayBufferFromUint8s");
const areByteArraysEqual = require("./../areArrayBuffersEqualByIndex/areArrayBuffersEqualByIndex");

const createFnToCheckSendingFragmentsOfResponse = require("./_createFnToCheckSendingFragmentsOfResponse");

const sendRequestByClient = (sender) => sender.sendBinaryRequest(new ArrayBuffer(
  sender.sizeOfHeaderForBinaryRequest
));

const setListenerOfRequest = (receiver, listener) => receiver.setBinaryRequestListener(listener);

const fragmentsOfResponse = [
  createByteArray([1, 2, 3, 4, 5, 6, 7, 8]),
  createByteArray([9, 10, 11, 12, 13, 14]),
  createByteArray([15, 16, 17, 18]),
  createByteArray([19, 20]),
];

const sendFramentsOfResponseByServer = (senderOfResponse, fragments) => (
  senderOfResponse.sendFragmentsOfBinaryResponse.apply(senderOfResponse, fragments)
);

const fullResponse = createByteArray([
  1, 2, 3, 4, 5, 6, 7, 8,
  9, 10, 11, 12, 13, 14,
  15, 16, 17, 18,
  19, 20
]);

const nameOfPropertyWithStartIndexOfBodyInResponse = "startIndexOfBodyInBinaryResponse";

module.exports = createFnToCheckSendingFragmentsOfResponse(
  sendRequestByClient,
  setListenerOfRequest,
  fragmentsOfResponse,
  sendFramentsOfResponseByServer,
  fullResponse,
  areByteArraysEqual,
  nameOfPropertyWithStartIndexOfBodyInResponse
);
