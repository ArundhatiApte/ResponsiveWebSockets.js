"use strict";

const expectDeepEqual = require("assert").deepStrictEqual;

const maxValueOfCounterOfAwaitingResponseMessages = Math.pow(2, 16) - 1;

const checkSendingManyMessagesAtOnce = async function(
  sender,
  nameOfStartIndexOfBodyInResponseProperty,
  receiver,
  createSendedMessage,
  createExpectedResponse,
  sendMessage,
  setListenerToSendResponseOnIncomingMessage,
  extractMessageFromResponse
) {
  const startIndexOfBodyInResponse = sender[nameOfStartIndexOfBodyInResponseProperty];
  setListenerToSendResponseOnIncomingMessage(receiver);

  const expectedResponses = [];
  const sendingMessages = [];

  for (let i = maxValueOfCounterOfAwaitingResponseMessages; i; ) {
    i -= 1;
    const sendedMessage = createSendedMessage(),
          expectedResponse = createExpectedResponse(sendedMessage);

    expectedResponses.push(expectedResponse);
    sendingMessages.push(sendMessageAndReceiveResponse(
      sender,
      sendMessage,
      sendedMessage,
      startIndexOfBodyInResponse,
      extractMessageFromResponse
    ));
  }

  const receivedResponses = await Promise.all(sendingMessages);

  const sendedMessage = createSendedMessage();
  const expectedResponse = createExpectedResponse(sendedMessage);

  expectedResponses.push(expectedResponse);
  receivedResponses.push(await sendMessageAndReceiveResponse(
    sender,
    sendMessage,
    sendedMessage,
    startIndexOfBodyInResponse,
    extractMessageFromResponse
  ));

  //console.log(expectedResponses, receivedResponses);

  receivedResponses.sort();
  expectedResponses.sort();

  expectDeepEqual(expectedResponses, receivedResponses);
};

const sendMessageAndReceiveResponse = async function(
  sender,
  sendMessage,
  message,
  startIndexOfBodyInResponse,
  extractMessageFromResponse
) {
  const {message: receivedMessage} = await sendMessage(sender, message);
  return extractMessageFromResponse(receivedMessage, startIndexOfBodyInResponse);
};

const createFnToCheckSendingManyMessagesAtOnce = function(
  nameOfStartIndexOfBodyInResponseProperty,
  createSendedMessage,
  createExpectedResponse,
  sendMessage,
  setListenerToSendResponseOnIncomingMessage,
  extractMessageFromResponse
) {
  return function(sender, receiver) {
    return checkSendingManyMessagesAtOnce(
      sender,
      nameOfStartIndexOfBodyInResponseProperty,
      receiver,
      createSendedMessage,
      createExpectedResponse,
      sendMessage,
      setListenerToSendResponseOnIncomingMessage,
      extractMessageFromResponse
    );
  };
};

module.exports = createFnToCheckSendingManyMessagesAtOnce;
