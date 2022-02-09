"use strict";

const expectDeepEqual = require("assert").deepStrictEqual;

const maxValueOfCounterOfAwaitedResponseMessages = Math.pow(2, 16) - 1;

const checkSendingManyMessagesAtOnce = async function(
  sender,
  getStartIndexOfBodyInResponseFromSender,
  receiver,
  createSendedMessage,
  createExpectedResponse,
  sendMessage,
  setListenerToSendResponseOnIncomingMessage,
  extractMessageFromResponse
) {
  const startIndexOfBodyInResponse = getStartIndexOfBodyInResponseFromSender(sender);
  setListenerToSendResponseOnIncomingMessage(receiver);
  
  const expectedResponses = [],
        sendingMessages = [];

  for (let i = maxValueOfCounterOfAwaitedResponseMessages; i; ) {
    i -= 1;
    const sendedMessage = createSendedMessage(),
          expectedResponse = createExpectedResponse(sendedMessage);

    expectedResponses.push(expectedResponse);
    sendingMessages.push(sendMessageAndReciveResponse(
      sender,
      sendMessage,
      sendedMessage,
      startIndexOfBodyInResponse,
      extractMessageFromResponse
    ));
  }
  
  const reciviedResponses = await Promise.all(sendingMessages);

  const sendedMessage = createSendedMessage(),
        expectedResponse = createExpectedResponse(sendedMessage);
  expectedResponses.push(expectedResponse);
  reciviedResponses.push(await sendMessageAndReciveResponse(
    sender,
    sendMessage,
    sendedMessage,
    startIndexOfBodyInResponse,
    extractMessageFromResponse
  ));

  //console.log(expectedResponses, reciviedResponses);

  reciviedResponses.sort();
  expectedResponses.sort();
  
  expectDeepEqual(expectedResponses, reciviedResponses);
};

const sendMessageAndReciveResponse = async function(
  sender,
  sendMessage,
  message,
  startIndexOfBodyInResponse,
  extractMessageFromResponse
) {
  const {message: reciviedMessage} = await sendMessage(sender, message);
  return extractMessageFromResponse(reciviedMessage, startIndexOfBodyInResponse);
};

const createFnToCheckSendingManyMessagesAtOnce = function(
  getStartIndexOfBodyInResponseFromSender,
  createSendedMessage,
  createExpectedResponse,
  sendMessage,
  setListenerToSendResponseOnIncomingMessage,
  extractMessageFromResponse
) {
  return function(sender, receiver) {
    return checkSendingManyMessagesAtOnce(
      sender,
      getStartIndexOfBodyInResponseFromSender,
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
