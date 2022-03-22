"use strict";

const testMessager = require("./../testMessager/testMessager");

const {
  createAwaitingResponseTextMessage,
  createUnrequestingTextMessage,
  createTextResponseToAwaitingResponseMessage,
  
  extractTypeOfIncomingMessage,
  extractIdOfMessage,
  
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
  
  extractTypeOfIncomingMessage,
  extractIdOfMessage,
  
  extractMessageFromMessageWithHeader(rawMessage, startIndex) {
    return rawMessage.slice(startIndex);
  },
  brokenMessage
});
