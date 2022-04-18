"use strict";

const expect = require("assert");
const areMapsEqual = require("./areMapsEqual");

const createFnToCheckSendingMessagesWithResponse = function(
  nameOfStartIndexOfBodyInResponseProperty,
  sendedMessageToExpectedResponse,
  nameOfSettingRequestListener,
  nameOfSendingRequestMethod,
  sendResponseOnRequest,
  extractMessageFromResponse
) {
  return checkSendingMessagesWithResponse.bind(
    null,
    nameOfStartIndexOfBodyInResponseProperty,
    sendedMessageToExpectedResponse,
    nameOfSettingRequestListener,
    nameOfSendingRequestMethod,
    sendResponseOnRequest,
    extractMessageFromResponse
  );
};

const checkSendingMessagesWithResponse =  async function(
  nameOfStartIndexOfBodyInResponseProperty,
  sendedMessageToExpectedResponse,
  nameOfSettingRequestListener,
  sendRequest,
  sendResponseOnRequest,
  extractMessageFromResponse,
  sender,
  receiver
) {
  const startIndexOfBodyInResponse = sender[nameOfStartIndexOfBodyInResponseProperty];
  const sendedMessageToResponse = new Map();

  receiver[nameOfSettingRequestListener](sendResponseOnRequest);

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
  expect.ok(areMapsEqual(sendedMessageToExpectedResponse, sendedMessageToResponse));
};

const sendMessageToReceiverAndAddResponseToMap = async function(
  sender,
  sendRequest,
  uniqueMessage,
  startIndexOfBodyInResponse,
  extractMessageFromResponse,
  sendedMessageToResponse
) {
  const dataAboutResponse = await sendRequest(sender, uniqueMessage);
  const response = extractMessageFromResponse(dataAboutResponse, startIndexOfBodyInResponse);

  sendedMessageToResponse.set(uniqueMessage, response);
};

module.exports = createFnToCheckSendingMessagesWithResponse;
