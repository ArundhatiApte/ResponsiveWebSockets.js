"use strict";

const createByteArray = require("./../utils/createByteArray");
const areByteArraysEqual = require("./../utils/areByteArraysEqual/areByteArraysEqual");

const createFnToCheckSendingFragmentsOfUnrequestingMessage = require(
  "./createFnToCheckSendingFragmentsOfUnrequestingMessage"
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

module.exports = createFnToCheckSendingFragmentsOfUnrequestingMessage(
  fragmentsOfMessage,
  sendFragmentsOfUnrequestingMessage,
  fullMessage,
  setListenerOfUnrequestingMessage,
  areByteArraysEqual
);
