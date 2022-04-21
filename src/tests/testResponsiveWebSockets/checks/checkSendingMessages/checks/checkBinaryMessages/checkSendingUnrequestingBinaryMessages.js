"use strict";

const createFnToCheckSendingUnrequestingMessages = require("./../../utils/createFnToCheckSendingUnrequestingMessages");

const {
  numberToInt32Bytes,
  int32BytesToNumber
} = require("./../../../../../modules/bytesInNumbers");

const sendedMessages = [1, 600, 1200, 98, 1872612, 12904];

const sendUnrequestingMessage = (sender, number) => sender.sendUnrequestingBinaryMessage(numberToInt32Bytes(number));
const extractMessageFromMessageWithHeader = (message, startIndex) => int32BytesToNumber(message, startIndex);

const checkSendingUnrequestingBinaryMessages = createFnToCheckSendingUnrequestingMessages(
  sendedMessages,
  "setUnrequestingBinaryMessageListener",
  sendUnrequestingMessage,
  extractMessageFromMessageWithHeader
);

module.exports = checkSendingUnrequestingBinaryMessages;
