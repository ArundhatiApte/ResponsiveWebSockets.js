"use strict";

const testMessager = require("./../testMessager");
const {
  createAwaitingResponseTextMessage,
  createUnrequestingTextMessage,
  createTextResponseToAwaitingResponseMessage,
  parseTextMessage,
  startIndexOfAwaitingResponseMessageBody,
  startIndexOfUnrequestingMessageBody,
  startIndexOfResponseMessageBody
} = require("./textMessager");

const messages = ["ansi", "utf8◈ℱ"],
      brokenMessage = "abcdef";

testMessager({
  nameOfTest: "test text messager",
  messages,
  
  createAwaitingResponseMessage: createAwaitingResponseTextMessage,
  startIndexOfAwaitingResponseMessageBody,
  
  createUnrequestingMessage: createUnrequestingTextMessage,
  startIndexOfUnrequestingMessageBody,
    
  createResponseMessage: createTextResponseToAwaitingResponseMessage,
  startIndexOfResponseMessageBody,
  
  parseMessage: parseTextMessage,
  extractMessageFromMessageWithHeader(rawMessage, startIndex) {
    return rawMessage.slice(startIndex);
  },
  brokenMessage
});
