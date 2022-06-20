"use strict";

const expectDeepEqual = require("assert").deepStrictEqual;

const maxValueOfCounterOfAwaitingResponseMessagesPlus1 = Math.pow(2, 16);

const checkSendingManyMessagesAtOnce = async function(
  sender,
  nameOfStartIndexOfBodyInResponseProperty,
  receiver,
  createSendedMessage,
  createExpectedResponse,
  sendRequest,
  setListenerToSendResponseOnIncomingMessage,
  extractMessageFromResponse
) {
  const startIndexOfBodyInResponse = sender[nameOfStartIndexOfBodyInResponseProperty];
  setListenerToSendResponseOnIncomingMessage(receiver);

  const expectedResponses = [];
  const sendingMessages = [];

  for (let i = 0; i < maxValueOfCounterOfAwaitingResponseMessagesPlus1; i += 1) {
    const sendedMessage = createSendedMessage(),
          expectedResponse = createExpectedResponse(sendedMessage);

    expectedResponses.push(expectedResponse);
    sendingMessages.push(sendMessageAndReceiveResponse(
      sender,
      sendRequest,
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
    sendRequest,
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
  sendRequest,
  message,
  startIndexOfBodyInResponse,
  extractMessageFromResponse
) {
  const response = await sendRequest(sender, message);
  return extractMessageFromResponse(response, startIndexOfBodyInResponse);
};

const createFnToCheckSendingManyMessagesAtOnce = function(
  nameOfStartIndexOfBodyInResponseProperty,
  createSendedMessage,
  createExpectedResponse,
  sendRequest,
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
      sendRequest,
      setListenerToSendResponseOnIncomingMessage,
      extractMessageFromResponse
    );
  };
};

module.exports = createFnToCheckSendingManyMessagesAtOnce;
