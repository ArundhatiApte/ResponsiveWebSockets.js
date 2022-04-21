"use strict";

const createFnToCheckSendingMessagesWithResponse =
  require("./../../utils/createFnToCheckSendingMessagesWithResponse");

const {
  numberToInt32Bytes,
  int32BytesToNumber
} = require("./../../../../../modules/bytesInNumbers");

const multiplier = 42;

const sendedMessageToExpectedResponse = new Map([-4, -3, -2, -1, 0, 1, 2, 3, 4].map((number) =>
  [number, number * multiplier]
));

const sendAwaitingResponseBinaryMessage = function(sender, number) {
  const bytes = numberToInt32Bytes(number);
  return sender.sendBinaryRequest(bytes);
};

const sendResponseOnAwaitingResponseMessage = function(bytesWithHeader, startIndex, senderOfResponse) {
  const receivedNumber = int32BytesToNumber(bytesWithHeader, startIndex),
        response = receivedNumber * multiplier;

  senderOfResponse.sendBinaryResponse(numberToInt32Bytes(response));
};

const extractMessageFromResponse = function(dataAboutResponse, startIndex) {
  const {message: bytesWithHeader} = dataAboutResponse;
  const number = int32BytesToNumber(bytesWithHeader, startIndex);
  return number;
};

const checkSendingAwaitingResponseBinaryMessages = createFnToCheckSendingMessagesWithResponse(
  "startIndexOfBodyInBinaryResponse",
  sendedMessageToExpectedResponse,
  "setBinaryRequestListener",
  sendAwaitingResponseBinaryMessage,
  sendResponseOnAwaitingResponseMessage,
  extractMessageFromResponse
);

module.exports = checkSendingAwaitingResponseBinaryMessages;
