"use strict";

const createFnToCheckendingManyMessagesAtOnce = require("./_createFnToCheckSendingManyMessagesAtOnce");

const {
  int32ToBytes,
  bytesToInt32
} = require("./../../../../modules/int32InArrayBuffer/int32InArrayBuffer");

const createSendedMessage = () => Math.floor(Math.random() * 10000) + 1;
const createExpectedResponse = (number) => number * 4;
const maxTimeMsForWaiting = 6000;
const extractMessageFromResponse = bytesToInt32;
const nameOfPropertyWithStartIndexInResponse = "startIndexOfBodyInBinaryResponse";

const sendRequestFromClient = function(sender, number) {
  const sizeOfHeader = sender.sizeOfHeaderForBinaryRequest;
  return sender.sendBinaryRequest(int32ToBytes(sizeOfHeader, number), maxTimeMsForWaiting);
};

const setListenerToSendResponseOnIncomingMessageFromServer = (receiver) => (
  receiver.setBinaryRequestListener(sendResponseOnIncomingMessageFromServer)
);

const sendResponseOnIncomingMessageFromServer = function(bytes, startIndex, senderOfResponse) {
  const number = bytesToInt32(bytes, startIndex);
  const response = int32ToBytes(0, number * 4);
  senderOfResponse.sendBinaryResponse(response);
};

const checkSendingManyBinaryRequestsAtOnceByClient = createFnToCheckendingManyMessagesAtOnce(
  nameOfPropertyWithStartIndexInResponse,
  createSendedMessage,
  createExpectedResponse,
  sendRequestFromClient,
  setListenerToSendResponseOnIncomingMessageFromServer,
  extractMessageFromResponse
);

const sendRequestFromServer = (sender, number) => sender.sendBinaryRequest(int32ToBytes(0, number));

const setListenerToSendResponseOnIncomingMessageFromClient = (receiver) => (
  receiver.setBinaryRequestListener(sendResponseOnIncomingMessageFromClient.bind(
    null,
    receiver.sizeOfHeaderForBinaryResponse
  ))
);

const sendResponseOnIncomingMessageFromClient = function(
  sizeOfHeaderForBinaryResponse,
  bytes,
  startIndex,
  senderOfResponse
) {
  const number = bytesToInt32(bytes, startIndex);
  const response = int32ToBytes(sizeOfHeaderForBinaryResponse, number * 4);
  senderOfResponse.sendBinaryResponse(response);
};

const checkSendingManyBinaryRequestsAtOnceByServer = createFnToCheckendingManyMessagesAtOnce(
  nameOfPropertyWithStartIndexInResponse,
  createSendedMessage,
  createExpectedResponse,
  sendRequestFromServer,
  setListenerToSendResponseOnIncomingMessageFromClient,
  extractMessageFromResponse
);

module.exports = {
  checkSendingManyBinaryRequestsAtOnceByClient,
  checkSendingManyBinaryRequestsAtOnceByServer
};
