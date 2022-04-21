"use strict";

const createFnToCheckSendingMessagesWithResponse =
  require("./../../utils/createFnToCheckSendingMessagesWithResponse");

const sendedMessageToExpectedResponse = new Map([
  "hello", "word", "utf\u1234\u1567"
].map((message) => [message, "(" + message + ")"]));

const sendAwaitingResponseTextMessage = (sender, message) => sender.sendTextRequest(message);

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

const checkSendingAwaitingResponseTextMessages = createFnToCheckSendingMessagesWithResponse(
  "startIndexOfBodyInTextResponse",
  sendedMessageToExpectedResponse,
  "setTextRequestListener",
  sendAwaitingResponseTextMessage,
  sendResponseOnAwaitingResponseMessage,
  extractMessageFromResponse
);

module.exports = checkSendingAwaitingResponseTextMessages;
