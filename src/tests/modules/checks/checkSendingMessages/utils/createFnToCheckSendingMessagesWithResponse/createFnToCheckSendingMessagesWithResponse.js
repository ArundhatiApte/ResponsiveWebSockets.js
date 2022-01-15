"use strict";

const expect = require("assert"),
      areMapsEqual = require("./areMapsEqual");

const checkSendingMessagesWithResponse =  async function(
  sender, recivier,
  sendedMessageToExpectedResponse, setAwaitedResponseMessageListener,
  sendMessage, sendResponseOnAwaitedResponseMessage,
  extractMessageFromResponse
) {
  const sendedMessageToResponse = new Map();

  setAwaitedResponseMessageListener(recivier, sendResponseOnAwaitedResponseMessage);

  const sendingMessages = [];
  for (const message of sendedMessageToExpectedResponse.keys()) {
    const sendingMessage = sendMessageToRecivierAndAddResponseToMap(
      sender, sendMessage, message,
      extractMessageFromResponse, sendedMessageToResponse
    );
    sendingMessages.push(sendingMessage);
  }
  await Promise.all(sendingMessages);
  expect.ok(areMapsEqual(sendedMessageToExpectedResponse, sendedMessageToResponse));
};

const sendMessageToRecivierAndAddResponseToMap = async function(
  sender, sendMessage, uniqueMessage, extractMessageFromResponse, sendedMessageToResponse
) {
  const dataAboutResponse = await sendMessage(sender, uniqueMessage),
        response = extractMessageFromResponse(dataAboutResponse);
  sendedMessageToResponse.set(uniqueMessage, response);
};

const createFnToCheckSendingMessagesWithResponse = function(
  sendedMessageToExpectedResponse, setAwaitedResponseMessageListener,
  sendMessage, sendResponseOnAwaitedResponseMessage,
  extractMessageFromResponse
) {
  return function(sender, recivier) {
    return checkSendingMessagesWithResponse(
      sender, recivier,
      sendedMessageToExpectedResponse, setAwaitedResponseMessageListener,
      sendMessage, sendResponseOnAwaitedResponseMessage,
      extractMessageFromResponse
    );
  };
};

module.exports = createFnToCheckSendingMessagesWithResponse;
