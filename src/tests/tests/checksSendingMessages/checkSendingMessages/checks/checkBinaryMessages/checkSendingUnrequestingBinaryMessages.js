"use strict";

const createFnToCheckSendingUnrequestingMessages = require("./../../utils/createFnToCheckSendingUnrequestingMessages");

const {
  numberToInt32Bytes,
  int32BytesToNumber
} = require("./../../../../../modules/bytesInNumbers");

const sendedMessages = [1, 600, 1200, 98, 1872612, 12904];

const sendMessage = function(sender, number) {
  return sender.sendUnResponsedBinaryMessage(numberToInt32Bytes(number));
};

const setUnrequestingMessageEventListener = function(recivier, listener) {
  return recivier.setUnrequestingBinaryMessageListener(listener);
};

const extractMessageFromMessageWithHeader = function(message, startIndex) {
  return int32BytesToNumber(message, startIndex);
};

const checkSendingUnrequestingBinaryMessages = createFnToCheckSendingUnrequestingMessages(
  sendedMessages, setUnrequestingMessageEventListener,
  sendMessage, extractMessageFromMessageWithHeader
);

module.exports = checkSendingUnrequestingBinaryMessages;
