"use strict";

const createFnToCheckendingManyMessagesAtOnce = require("./_createFnToCheckSendingManyMessagesAtOnce");

const createSendedMessage = () => "msg" + Math.floor(Math.random(10));

const createExpectedResponse = (message) => message + "#";

const maxTimeMsForWaiting = 8000;

const sendMessage = function(sender, message) {
  return sender.sendTextRequest(message, maxTimeMsForWaiting);
};

const setListenerToSendResponseOnIncomingMessage = (receiver) => (
  receiver.setTextRequestListener(sendResponseOnIncomingMessage)
);

const sendResponseOnIncomingMessage = function(stringWithHeader, startIndex, senderOfResponse) {
  const message = extractMessageFromResponse(stringWithHeader, startIndex);
  senderOfResponse.sendTextResponse(createExpectedResponse(message));
};

const extractMessageFromResponse = (stringWithHeader, startIndex) => stringWithHeader.slice(startIndex);

module.exports = createFnToCheckendingManyMessagesAtOnce(
  "startIndexOfBodyInTextResponse",
  createSendedMessage,
  createExpectedResponse,
  sendMessage,
  setListenerToSendResponseOnIncomingMessage,
  extractMessageFromResponse
);
