"use strict";

const createFnToCheckSendingMessagesWithResponse =
  require("./../../utils/createFnToCheckSendingMessagesWithResponse");

const sendedMessageToExpectedResponse = new Map([
  "hello", "word", "utf\u1234\u1567"
].map(function(message) {
  return [message, "(" + message + ")"];
}));

const sendAwaitingResponseTextMessage = function(sender, message) {
  return sender.sendAwaitingResponseTextMessage(message);
};

const setAwaitingResponseMessageListener = function(receiver, listener) {
  return receiver.setAwaitingResponseTextMessageListener(listener);
};

const sendResponseOnAwaitingResponseMessage = function(
  messageWithHeader, startIndex, senderOfResponse
) {
  const message = messageWithHeader.slice(startIndex);
  senderOfResponse.sendTextResponse("(" + message + ")");
};

const extractMessageFromResponse = function(dataAboutResponse) {
  const {
    message,
    startIndex
  } = dataAboutResponse;
  return message.slice(startIndex);
};

const checkSendingAwaitingResponseTextMessages = createFnToCheckSendingMessagesWithResponse(
  sendedMessageToExpectedResponse, setAwaitingResponseMessageListener,
  sendAwaitingResponseTextMessage, sendResponseOnAwaitingResponseMessage,
  extractMessageFromResponse
);

module.exports = checkSendingAwaitingResponseTextMessages;
