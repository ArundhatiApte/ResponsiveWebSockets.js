"use strict";

const testMessager = require("./../testMessager");
const {
  createAwaitingResponseTextMessage,
  createUnrequestingTextMessage,
  createTextResponseToAwaitingResponseMessage,
  parseTextMessage
} = require("./textMessager");

const messages = ["ansi", "utf8◈ℱ"],
      brokenMessage = "abcdef";

testMessager({
  nameOfTest: "test text messager",
  messages,
  createAwaitingResponseMessage: createAwaitingResponseTextMessage,
  createUnrequestingMessage: createUnrequestingTextMessage,
  createResponseMessage: createTextResponseToAwaitingResponseMessage,
  parseMessage: parseTextMessage,
  extractMessageFromMessageWithHeader(rawMessage, startIndex) {
    return rawMessage.slice(startIndex);
  },
  brokenMessage
});
