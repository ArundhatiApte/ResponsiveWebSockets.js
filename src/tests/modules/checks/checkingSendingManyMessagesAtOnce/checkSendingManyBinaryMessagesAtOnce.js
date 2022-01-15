"use strict";

const createFnToCheckendingManyMessagesAtOnce = require("./_createFnToCheckSendingManyMessagesAtOnce");

const {
  numberToInt32Bytes,
  int32BytesToNumber
} = require("./../../bytesInNumbers");

const createSendedMessage = function() {
  return Math.floor(Math.random() * 10000) + 1;
};

const createExpectedResponse = function(number) {
  return number * 4;
};

const sendMessage = function(sender, number) {
  return sender.sendAwaitingResponseBinaryMessage(numberToInt32Bytes(number));
};

const setListenerToSendResponseOnIncomingMessage = function(recivier) {
  return recivier.setAwaitingResponseBinaryMessageListener(sendResponseOnIncomingMessage);
};

const sendResponseOnIncomingMessage = function(bytes, startIndex, senderOfResponse) {
  const number = int32BytesToNumber(bytes, startIndex);
  const response = numberToInt32Bytes(number * 4);
  senderOfResponse.sendBinaryResponse(response);
};

const extractMessageFromResponse = int32BytesToNumber;

module.exports = createFnToCheckendingManyMessagesAtOnce(
  createSendedMessage, createExpectedResponse,
  sendMessage, setListenerToSendResponseOnIncomingMessage,
  extractMessageFromResponse
);
