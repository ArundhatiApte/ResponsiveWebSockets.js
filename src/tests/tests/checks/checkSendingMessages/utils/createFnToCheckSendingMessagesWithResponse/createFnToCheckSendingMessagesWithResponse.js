"use strict";

const expect = require("assert"),
      areMapsEqual = require("./areMapsEqual");

const checkSendingMessagesWithResponse =  async function(
  sender,
  getStartIndexOfBodyInResponseFromSender,
  receiver,
  sendedMessageToExpectedResponse,
  setAwaitedResponseMessageListener,
  sendMessage,
  sendResponseOnAwaitedResponseMessage,
  extractMessageFromResponse
) {
  const startIndexOfBodyInResponse = getStartIndexOfBodyInResponseFromSender(sender);
  const sendedMessageToResponse = new Map();

  setAwaitedResponseMessageListener(receiver, sendResponseOnAwaitedResponseMessage);

  const sendingMessages = [];
  for (const message of sendedMessageToExpectedResponse.keys()) {
    const sendingMessage = sendMessageToReceiverAndAddResponseToMap(
      sender,
      sendMessage,
      message,
      startIndexOfBodyInResponse,
      extractMessageFromResponse,
      sendedMessageToResponse
    );
    sendingMessages.push(sendingMessage);
  }
  await Promise.all(sendingMessages);
  expect.ok(areMapsEqual(sendedMessageToExpectedResponse, sendedMessageToResponse));
};

const sendMessageToReceiverAndAddResponseToMap = async function(
  sender,
  sendMessage,
  uniqueMessage,
  startIndexOfBodyInResponse,
  extractMessageFromResponse,
  sendedMessageToResponse
) {
  const dataAboutResponse = await sendMessage(sender, uniqueMessage),
        response = extractMessageFromResponse(dataAboutResponse, startIndexOfBodyInResponse);
  sendedMessageToResponse.set(uniqueMessage, response);
};

const createFnToCheckSendingMessagesWithResponse = function(
  getStartIndexOfBodyInResponseFromSender,
  sendedMessageToExpectedResponse,
  setAwaitedResponseMessageListener,
  sendMessage,
  sendResponseOnAwaitedResponseMessage,
  extractMessageFromResponse
) {
  return function(sender, receiver) {
    return checkSendingMessagesWithResponse(
      sender,
      getStartIndexOfBodyInResponseFromSender,
      receiver,
      sendedMessageToExpectedResponse,
      setAwaitedResponseMessageListener,
      sendMessage,
      sendResponseOnAwaitedResponseMessage,
      extractMessageFromResponse
    );
  };
};

module.exports = createFnToCheckSendingMessagesWithResponse;
