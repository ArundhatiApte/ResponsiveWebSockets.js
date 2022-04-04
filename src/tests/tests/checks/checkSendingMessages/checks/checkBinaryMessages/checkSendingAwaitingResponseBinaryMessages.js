"use strict";

const createFnToCheckSendingMessagesWithResponse =
  require("./../../utils/createFnToCheckSendingMessagesWithResponse");

const {
  numberToInt32Bytes,
  int32BytesToNumber
} = require("./../../../../../modules/bytesInNumbers");

const multiplier = 42;

const sendedMessageToExpectedResponse = new Map([-4, -3, -2, -1, 0, 1, 2, 3, 4].map(function(number) {
  return [number, number * multiplier];
}));

const setAwaitingResponseMessageListener = function(recivier, listener) {
  return recivier.setBinaryRequestListener(listener);
};

const sendAwaitingResponseBinaryMessage = function(sender, number) {
  const bytes = numberToInt32Bytes(number);
  return sender.sendBinaryRequest(bytes);
};

const sendResponseOnAwaitingResponseMessage = function(bytesWithHeader, startIndex, senderOfResponse) {
  const reciviedNumber = int32BytesToNumber(bytesWithHeader, startIndex),
        response = reciviedNumber * multiplier;
  senderOfResponse.sendBinaryResponse(numberToInt32Bytes(response));
};

const extractMessageFromResponse = function(dataAboutResponse, startIndex) {
  const {message: bytesWithHeader} = dataAboutResponse;
  const number = int32BytesToNumber(bytesWithHeader, startIndex);
  return number;
};

const getStartIndexOfBodyInResponseFromSender = function(sender) {
  return sender.startIndexOfBodyInBinaryResponse;
};

const checkSendingAwaitingResponseBinaryMessages = createFnToCheckSendingMessagesWithResponse(
  getStartIndexOfBodyInResponseFromSender,
  sendedMessageToExpectedResponse,
  setAwaitingResponseMessageListener,
  sendAwaitingResponseBinaryMessage,
  sendResponseOnAwaitingResponseMessage,
  extractMessageFromResponse
);

module.exports = checkSendingAwaitingResponseBinaryMessages;
