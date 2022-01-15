"use strict";

const createFnToCheckSendingUnrequestingMessages = require("./../../utils/createFnToCheckSendingUnrequestingMessages");

const sendedMessages = ["some", "text", "zzzzzzzzzzzz", '\u6781'];

const sendMessage = function(sender, text) {
  return sender.sendUnrequestingTextMessage(text);
};

const setUnrequestingMessageEventListener = function(receiver, listener) {
  return receiver.setUnrequestingTextMessageListener(listener);
};

const extractMessageFromMessageWithHeader = function(message, startIndex) {
  return message.slice(startIndex);
};

const checkSendingUnrequestingBinaryMessages = createFnToCheckSendingUnrequestingMessages(
  sendedMessages, setUnrequestingMessageEventListener,
  sendMessage, extractMessageFromMessageWithHeader
);

module.exports = checkSendingUnrequestingBinaryMessages;
