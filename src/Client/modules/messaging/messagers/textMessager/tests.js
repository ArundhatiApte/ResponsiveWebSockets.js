"use strict";

const testMessager = require("./../testMessager/testMessager");

const {
  createRequestMessage,
  createUnrequestingMessage,
  createResponseMessage,

  extractTypeOfIncomingMessage,
  extractIdOfMessage,

  startIndexOfBodyInRequest,
  startIndexOfBodyInUnrequestingMessage,
  startIndexOfBodyInResponse
} = require("./textMessager");

const messages = ["ansi", "utf8◈ℱ"];
const brokenMessage = "abcdef";

testMessager(describe, it, {
  nameOfTest: "client text messager",
  messages,

  createRequestMessage,
  startIndexOfBodyInRequest,

  createUnrequestingMessage,
  startIndexOfBodyInUnrequestingMessage,

  createResponseMessage,
  startIndexOfBodyInResponse,

  extractTypeOfIncomingMessage,
  extractIdOfMessage,

  extractMessageFromMessageWithHeader(rawMessage, startIndex) {
    return rawMessage.slice(startIndex);
  },
  brokenMessage
});
