"use strict";

const createByteArray = require("./../../utils/createArrayBufferFromUint8s");
const areByteArraysEqual = require("./../areArrayBuffersEqualByIndex/areArrayBuffersEqualByIndex");

const createFnToCheckSendingFragmentsOfUnrequestingMessage = require(
  "./_createFnToCheckSendingFragmentsOfUnrequestingMessage"
);

const fragmentsOfMessage = [
  createByteArray([10, 20, 30, 40]),
  createByteArray([11, 22, 33, 44])
];

const sendFragmentsOfUnrequestingMessage = function(sender, fragments) {
  return sender.sendFragmentsOfUnrequestingBinaryMessage.apply(sender, fragments);
};

const fullMessage = createByteArray([
  10, 20, 30, 40,
  11, 22, 33, 44
]);

const setListenerOfUnrequestingMessage = function(receiver, listener) {
  return receiver.setUnrequestingBinaryMessageListener(listener);
};

const checkSendingFragmentsOfUnrequestingBinaryMessage = createFnToCheckSendingFragmentsOfUnrequestingMessage(
  fragmentsOfMessage,
  sendFragmentsOfUnrequestingMessage,
  fullMessage,
  setListenerOfUnrequestingMessage,
  areByteArraysEqual
);

module.exports = checkSendingFragmentsOfUnrequestingBinaryMessage;
