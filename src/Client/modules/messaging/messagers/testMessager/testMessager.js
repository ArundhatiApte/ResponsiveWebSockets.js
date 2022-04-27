"use strict";

const checkCreatingAndParsingAwaitingResponseMessages =
  require("./checks/checkCreatingAndParsingAwaitingResponseMessages");

const checkCreatingAndParsingUnrequestingMessage = require("./checks/checkCreatingAndParsingUnrequestingMessage");
const checkCreatingAndParsingResponseMessages = require("./checks/checkCreatingAndParsingResponseMessages");

const checkThrowingErrorAtParsing =
  require("./checks/checkThrowingErrorAtParsing");

const testMessager = function(describeTests, addTest, options) {
  const {
    nameOfTest,
    messages,

    createRequestMessage,
    startIndexOfBodyInRequest,

    createUnrequestingMessage,
    startIndexOfBodyInUnrequestingMessage,

    createResponseMessage,
    startIndexOfBodyInResponse,

    extractTypeOfIncomingMessage,
    extractIdOfMessage,
    extractMessageFromMessageWithHeader,
    brokenMessage
  } = options;

  describeTests(nameOfTest, function() {
    addTest("creating and parsing awaiting response messages", createTest(
      checkCreatingAndParsingAwaitingResponseMessages,
      createRequestMessage,
      messages,
      startIndexOfBodyInRequest,
      extractTypeOfIncomingMessage,
      extractIdOfMessage,
      extractMessageFromMessageWithHeader
    ));

    addTest("creating and parsing response messages", createTest(
      checkCreatingAndParsingResponseMessages,
      createResponseMessage,
      messages,
      startIndexOfBodyInResponse,
      extractTypeOfIncomingMessage,
      extractIdOfMessage,
      extractMessageFromMessageWithHeader
    ));

    addTest("creating and parsing unrequesting messages", createTest(
      checkCreatingAndParsingUnrequestingMessage,
      createUnrequestingMessage,
      messages[0],
      startIndexOfBodyInUnrequestingMessage,
      extractTypeOfIncomingMessage,
      extractMessageFromMessageWithHeader
    ));

    addTest("throwing error at parsing", createTest(
      checkThrowingErrorAtParsing,
      brokenMessage,
      extractTypeOfIncomingMessage
    ));
  });
};

const createTest = function(check, ...args) {
  return check.bind(null, ...args);
};

module.exports = testMessager;
