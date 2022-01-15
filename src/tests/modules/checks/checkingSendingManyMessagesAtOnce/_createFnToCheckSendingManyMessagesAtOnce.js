"use strict";

const expectDeepEqual = require("assert").deepStrictEqual;

const maxValueOfCounterOfAwaitedResponseMessages = Math.pow(2, 16) - 1;

const checkSendingManyMessagesAtOnce = async function(
  sender, recivier,
  createSendedMessage, createExpectedResponse,
  sendMessage, setListenerToSendResponseOnIncomingMessage,
  extractMessageFromResponse
) {
  setListenerToSendResponseOnIncomingMessage(recivier);
  
  const expectedResponses = [],
        sendingMessages = [];
        
  for (let i = maxValueOfCounterOfAwaitedResponseMessages; i; ) {
    i -= 1;
    const sendedMessage = createSendedMessage(),
          expectedResponse = createExpectedResponse(sendedMessage);

    expectedResponses.push(expectedResponse);
    sendingMessages.push(sendMessageAndReciveResponse(sender, sendMessage, sendedMessage, extractMessageFromResponse));
  }
  
  const reciviedResponses = await Promise.all(sendingMessages);

  const sendedMessage = createSendedMessage(),
        expectedResponse = createExpectedResponse(sendedMessage);
  expectedResponses.push(expectedResponse);
  reciviedResponses.push(await sendMessageAndReciveResponse(sender, sendMessage, sendedMessage, extractMessageFromResponse));

  //console.log(expectedResponses, reciviedResponses);

  reciviedResponses.sort();
  expectedResponses.sort();
  
  expectDeepEqual(expectedResponses, reciviedResponses);
};

const sendMessageAndReciveResponse = async function(
  sender, sendMessage, message, extractMessageFromResponse
) {
  const {
    message: reciviedMessage, startIndex
  } = await sendMessage(sender, message);
  return extractMessageFromResponse(reciviedMessage, startIndex);
};

const createFnToCheckSendingManyMessagesAtOnce = function(
  createSendedMessage, createExpectedResponse,
  sendMessage, setListenerToSendResponseOnIncomingMessage,
  extractMessageFromResponse
) {
  return function(sender, recivier) {
    return checkSendingManyMessagesAtOnce(
      sender, recivier,
      createSendedMessage, createExpectedResponse,
      sendMessage, setListenerToSendResponseOnIncomingMessage,
      extractMessageFromResponse
    );
  };
};

module.exports = createFnToCheckSendingManyMessagesAtOnce;
