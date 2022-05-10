"use strict";

const createFnToCheckSendingMessagesWithResponse = require(
  "./../utils/createFnToCheckSendingMessagesWithResponse"
);

const {
  int32ToBytes,
  bytesToInt32
} = require("./../../../../../modules/int32InArrayBuffer/int32InArrayBuffer");

const multiplier = 42;

const sendedMessageToExpectedResponse = new Map([-4, -3, -2, -1, 0, 1, 2, 3, 4].map((number) =>
  [number, number * multiplier]
));

const sendBinaryRequestByClient = function(sender, number) {
  return sender.sendBinaryRequest(int32ToBytes(sender.sizeOfHeaderForBinaryRequest, number));
};

const setBinaryRequestListenerAtServer = (receiver) => (
  receiver.setBinaryRequestListener(sendBinaryResponseByServer)
);

const sendBinaryResponseByServer = function(bytesWithHeader, startIndex, senderOfResponse) {
  const receivedNumber = bytesToInt32(bytesWithHeader, startIndex),
        response = receivedNumber * multiplier;

  senderOfResponse.sendBinaryResponse(int32ToBytes(0, response));
};

const extractMessageFromResponse = (bytesWithHeader, startIndex) => bytesToInt32(bytesWithHeader, startIndex);

const checkSendingBinaryRequestsByClient = createFnToCheckSendingMessagesWithResponse(
  "startIndexOfBodyInBinaryResponse",
  sendedMessageToExpectedResponse,
  sendBinaryRequestByClient,
  setBinaryRequestListenerAtServer,
  extractMessageFromResponse
);

const sendBinaryRequestByServer = (sender, number) => sender.sendBinaryRequest(int32ToBytes(0, number));

const setBinaryRequestListenerAtClient = (receiver) => (
  receiver.setBinaryRequestListener(sendBinaryResponseByClient.bind(
    null,
    receiver.sizeOfHeaderForBinaryResponse
  ))
);

const sendBinaryResponseByClient = function(
  sizeOfHeaderForBinaryResponse,
  bytesWithHeader,
  startIndex,
  senderOfResponse
) {
  const receivedNumber = bytesToInt32(bytesWithHeader, startIndex);
  const responseNumber = receivedNumber * multiplier;
  senderOfResponse.sendBinaryResponse(int32ToBytes(sizeOfHeaderForBinaryResponse, responseNumber));
};

const checkSendingBinaryRequestsByServer = createFnToCheckSendingMessagesWithResponse(
  "startIndexOfBodyInBinaryResponse",
  sendedMessageToExpectedResponse,
  sendBinaryRequestByServer,
  setBinaryRequestListenerAtClient,
  extractMessageFromResponse
);

module.exports = {
  checkSendingBinaryRequestsByClient,
  checkSendingBinaryRequestsByServer
};
