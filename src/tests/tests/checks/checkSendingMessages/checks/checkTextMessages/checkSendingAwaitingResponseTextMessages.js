"use strict";

const createFnToCheckSendingMessagesWithResponse =
  require("./../../utils/createFnToCheckSendingMessagesWithResponse");

const sendedMessageToExpectedResponse = new Map([
  "hello", "word", "utf\u1234\u1567"
].map(function(message) {
  return [message, "(" + message + ")"];
}));

const sendAwaitingResponseTextMessage = function(sender, message) {
  return sender.sendTextRequest(message);
};

const setAwaitingResponseMessageListener = function(receiver, listener) {
  return receiver.setTextRequestListener(listener);
};

const sendResponseOnAwaitingResponseMessage = function(
  messageWithHeader, startIndex, senderOfResponse
) {
  const message = messageWithHeader.slice(startIndex);
  senderOfResponse.sendTextResponse("(" + message + ")");
};

const extractMessageFromResponse = function(dataAboutResponse, startIndex) {
  const {message} = dataAboutResponse;
  return message.slice(startIndex);
};

const getStartIndexOfBodyInResponseFromSender = function(sender) {
  return sender.startIndexOfBodyInTextResponse;
};

const checkSendingAwaitingResponseTextMessages = createFnToCheckSendingMessagesWithResponse(
  getStartIndexOfBodyInResponseFromSender,
  sendedMessageToExpectedResponse,
  setAwaitingResponseMessageListener,
  sendAwaitingResponseTextMessage,
  sendResponseOnAwaitingResponseMessage,
  extractMessageFromResponse
);

module.exports = checkSendingAwaitingResponseTextMessages;
