"use strict";

const createFnToCheckSendingUnrequestingMessages = require("./../../utils/createFnToCheckSendingUnrequestingMessages");

const sendedMessages = ["some", "text", "zzzzzzzzzzzz", '\u6781'];

const sendUnrequestingMessage = (sender, text) => sender.sendUnrequestingTextMessage(text);
const extractMessageFromMessageWithHeader = (message, startIndex) => message.slice(startIndex);;

const checkSendingUnrequestingBinaryMessages = createFnToCheckSendingUnrequestingMessages(
  sendedMessages,
  "setUnrequestingTextMessageListener",
  sendUnrequestingMessage,
  extractMessageFromMessageWithHeader
);

module.exports = checkSendingUnrequestingBinaryMessages;
