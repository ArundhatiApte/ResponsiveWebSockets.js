"use strict";

const createFnToCheckendingManyMessagesAtOnce = require("./_createFnToCheckSendingManyMessagesAtOnce");

const createSendedMessage = function() {
  return "msg" + Math.floor(Math.random(10));
};

const createExpectedResponse = function(message) {
  return message + "#";
};

const maxTimeMSForWaiting = 8000;

const sendMessage = function(sender, message) {
  return sender.sendTextRequest(message, maxTimeMSForWaiting);
};

const setListenerToSendResponseOnIncomingMessage = function(recivier) {
  return recivier.setTextRequestListener(sendResponseOnIncomingMessage);
};

const sendResponseOnIncomingMessage = function(stringWithHeader, startIndex, senderOfResponse) {
  const message = extractMessageFromResponse(stringWithHeader, startIndex);
  senderOfResponse.sendTextResponse(message + "#");
};

const extractMessageFromResponse = function(stringWithHeader, startIndex) {
  return stringWithHeader.slice(startIndex);
};

module.exports = createFnToCheckendingManyMessagesAtOnce(
  createSendedMessage,
  createExpectedResponse,
  sendMessage,
  setListenerToSendResponseOnIncomingMessage,
  extractMessageFromResponse
);
