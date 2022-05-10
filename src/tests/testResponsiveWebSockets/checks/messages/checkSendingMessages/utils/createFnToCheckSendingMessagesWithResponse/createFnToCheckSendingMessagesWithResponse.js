"use strict";

const expectTrue = require("assert").ok;
const areMapsEqual = require("./areMapsEqual");

const createFnToCheckSendingMessagesWithResponse = function(
  nameOfStartIndexOfBodyInResponseProperty,
  sendedMessageToExpectedResponse,
  nameOfSendingRequestMethod,
  setRequestListenerAtReceiver,
  extractMessageFromResponse
) {
  return checkSendingMessagesWithResponse.bind(
    null,
    nameOfStartIndexOfBodyInResponseProperty,
    sendedMessageToExpectedResponse,
    nameOfSendingRequestMethod,
    setRequestListenerAtReceiver,
    extractMessageFromResponse
  );
};

const checkSendingMessagesWithResponse =  async function(
  nameOfStartIndexOfBodyInResponseProperty,
  sendedMessageToExpectedResponse,
  sendRequest,
  setRequestListenerAtReceiver,
  extractMessageFromResponse,
  sender,
  receiver
) {
  const startIndexOfBodyInResponse = sender[nameOfStartIndexOfBodyInResponseProperty];
  const sendedMessageToResponse = new Map();

  setRequestListenerAtReceiver(receiver);

  const sendingMessages = [];
  for (const message of sendedMessageToExpectedResponse.keys()) {
    const sendingMessage = sendMessageToReceiverAndAddResponseToMap(
      sender,
      sendRequest,
      message,
      startIndexOfBodyInResponse,
      extractMessageFromResponse,
      sendedMessageToResponse
    );
    sendingMessages.push(sendingMessage);
  }
  await Promise.all(sendingMessages);
  expectTrue(areMapsEqual(sendedMessageToExpectedResponse, sendedMessageToResponse));
};

const sendMessageToReceiverAndAddResponseToMap = async function(
  sender,
  sendRequest,
  uniqueMessage,
  startIndexOfBodyInResponse,
  extractMessageFromResponse,
  sendedMessageToResponse
) {
  const responseWithHeader = await sendRequest(sender, uniqueMessage);
  const response = extractMessageFromResponse(responseWithHeader, startIndexOfBodyInResponse);

  sendedMessageToResponse.set(uniqueMessage, response);
};

module.exports = createFnToCheckSendingMessagesWithResponse;
