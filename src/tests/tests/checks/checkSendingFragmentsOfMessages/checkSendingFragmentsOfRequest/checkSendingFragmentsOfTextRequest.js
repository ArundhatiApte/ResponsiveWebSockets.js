"use strict";

const areStringsEqual = require("./../utils/areStringsEqual");

const createFnToCheckSendingFragmentsOfRequest = require("./createFnToCheckSendingFragmentsOfRequest");

const fragmentsOfRequest = ["one , ", " Two. ", " 3333 ", "IV"];

const sendFragmentsOfRequest = function(sender, fragments) {
  return sender.sendFragmentsOfTextRequest.apply(sender, fragments);
};

const fullRequest = fragmentsOfRequest.join("");

const setListenerOfRequest = function(receiver, listener) {
  return receiver.setTextRequestListener(listener);
};

const response = "lorem ipsum";

const sendResponse = function(senderOfResponse, response) {
  return senderOfResponse.sendTextResponse(response);
};

module.exports = createFnToCheckSendingFragmentsOfRequest(
  fragmentsOfRequest,
  sendFragmentsOfRequest,
  fullRequest,
  areStringsEqual,
  setListenerOfRequest,
  response,
  sendResponse
);
