"use strict";

const createFnToCheckendingManyMessagesAtOnce = require("./_createFnToCheckSendingManyMessagesAtOnce");

const {
  numberToInt32Bytes,
  int32BytesToNumber
} = require("./../../../modules/bytesInNumbers");

const createSendedMessage = () => Math.floor(Math.random() * 10000) + 1;

const createExpectedResponse = (number) => number * 4;

const maxTimeMsForWaiting = 6000;

const sendMessage = (sender, number) => sender.sendBinaryRequest(numberToInt32Bytes(number), maxTimeMsForWaiting);

const setListenerToSendResponseOnIncomingMessage = (receiver) => (
  receiver.setBinaryRequestListener(sendResponseOnIncomingMessage)
);

const sendResponseOnIncomingMessage = function(bytes, startIndex, senderOfResponse) {
  const number = int32BytesToNumber(bytes, startIndex);
  const response = numberToInt32Bytes(number * 4);
  senderOfResponse.sendBinaryResponse(response);
};

const extractMessageFromResponse = int32BytesToNumber;

module.exports = createFnToCheckendingManyMessagesAtOnce(
  "startIndexOfBodyInBinaryResponse",
  createSendedMessage,
  createExpectedResponse,
  sendMessage,
  setListenerToSendResponseOnIncomingMessage,
  extractMessageFromResponse
);
