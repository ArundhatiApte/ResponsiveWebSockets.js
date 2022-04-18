"use strict";

const createByteArray = require("./../utils/createByteArray");
const areByteArraysEqual = require("./../utils/areByteArraysEqual/areByteArraysEqual");

const createFnToCheckSendingFragmentsOfRequest = require("./_createFnToCheckSendingFragmentsOfRequest");

const fragmentsOfRequest = [
  createByteArray([1, 1, 1, 1]),
  createByteArray([2, 2, 2, 2]),
  createByteArray([3, 3, 3, 3]),
  createByteArray([4, 4, 4, 4])
];

const fullRequest = createByteArray([
  1, 1, 1, 1,
  2, 2, 2, 2,
  3, 3, 3, 3,
  4, 4, 4, 4
]);

const fullResponse = createByteArray([1, 2, 3, 4]);

module.exports = createFnToCheckSendingFragmentsOfRequest(
  fragmentsOfRequest,
  "sendFragmentsOfBinaryRequest",
  fullRequest,
  areByteArraysEqual,
  "setBinaryRequestListener",
  fullResponse,
  "sendBinaryResponse"
);
