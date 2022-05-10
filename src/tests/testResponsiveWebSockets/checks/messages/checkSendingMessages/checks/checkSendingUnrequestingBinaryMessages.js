"use strict";

const createFnToCheckSendingUnrequestingMessages = require(
  "./../utils/createFnToCheckSendingUnrequestingMessages"
);

const {
  int32ToBytes,
  bytesToInt32
} = require("./../../../../../modules/int32InArrayBuffer/int32InArrayBuffer");

const sendedMessages = [1, 600, 1200, 98, 1872612, 12904];

const sendUnrequestingMessageByClient = function(sender, number) {
  const sizeOfHeader = sender.sizeOfHeaderForUnrequestingBinaryMessage;
  sender.sendUnrequestingBinaryMessage(int32ToBytes(sizeOfHeader, number))
};
const extractMessageFromMessageWithHeader = (message, startIndex) => bytesToInt32(message, startIndex);

const checkSendingUnrequestingBinaryMessagesByClient = createFnToCheckSendingUnrequestingMessages(
  sendedMessages,
  "setUnrequestingBinaryMessageListener",
  sendUnrequestingMessageByClient,
  extractMessageFromMessageWithHeader
);

const sendUnrequestingMessageByServer = (sender, number) => (
  sender.sendUnrequestingBinaryMessage(int32ToBytes(0, number))
);

const checkSendingUnrequestingBinaryMessagesByServer = createFnToCheckSendingUnrequestingMessages(
  sendedMessages,
  "setUnrequestingBinaryMessageListener",
  sendUnrequestingMessageByServer,
  extractMessageFromMessageWithHeader
);

module.exports = {
  checkSendingUnrequestingBinaryMessagesByClient,
  checkSendingUnrequestingBinaryMessagesByServer
};
