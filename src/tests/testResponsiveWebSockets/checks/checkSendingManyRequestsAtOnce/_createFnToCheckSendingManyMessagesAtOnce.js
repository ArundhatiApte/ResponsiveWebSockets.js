"use strict";

const expectDeepEqual = require("assert").deepStrictEqual;

const maxValueOfCounterOfAwaitingResponseMessagesPlus1 = Math.pow(2, 16);

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

  for (let i = 0; i < maxValueOfCounterOfAwaitingResponseMessagesPlus1; i += 1) {
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
  //const {message: receivedMessage} = await sendMessage(sender, message);
  let response;
  try {
    response = await sendMessage(sender, message);
  } catch(error) {
    console.log("ошибка получения ответа, запрос: ", message);
  }
  return extractMessageFromResponse(response.message, startIndexOfBodyInResponse);
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
