"use strict";

const areStringsEqual = require("./../utils/areStringsEqual");

const createFnToCheckSendingFragmentsOfUnrequestingMessage = require(
  "./_createFnToCheckSendingFragmentsOfUnrequestingMessage"
);

const fragmentsOfMessage = [
  "aisdhwadwahjdwiahdiawudaundsiudwaundsudnawiudsadbwuiabdsad",
  "aspodJWIOQADNqidiuqandqiudnwiqunsid"
];

const sendFragmentsOfUnrequestingMessage = function(sender, fragments) {
  return sender.sendFragmentsOfUnrequestingTextMessage.apply(sender, fragments);
};

const fullMessage = fragmentsOfMessage.join("");

const setListenerOfUnrequestingMessage = function(receiver, listener) {
  return receiver.setUnrequestingTextMessageListener(listener);
};

module.exports = createFnToCheckSendingFragmentsOfUnrequestingMessage(
  fragmentsOfMessage,
  sendFragmentsOfUnrequestingMessage,
  fullMessage,
  setListenerOfUnrequestingMessage,
  areStringsEqual
);

