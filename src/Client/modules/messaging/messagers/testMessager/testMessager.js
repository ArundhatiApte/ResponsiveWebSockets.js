"use strict";

const checkCreatingAndParsingAwaitingResponseMessages =
  require("./checks/checkCreatingAndParsingAwaitingResponseMessages");

const checkCreatingAndParsingUnrequestingMessages =
  require("./checks/checkCreatingAndParsingUnrequestingMessages");

const checkCreatingAndParsingResponseMessages =
  require("./checks/checkCreatingAndParsingResponseMessages");

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

  const checkigFnToCreatingMessageFnAndNameOfTest = [
    [
      checkCreatingAndParsingAwaitingResponseMessages,
      startIndexOfBodyInRequest,
      createRequestMessage,
      "creating and parsing awaiting response messages"
    ],
    [
      checkCreatingAndParsingUnrequestingMessages,
      startIndexOfBodyInUnrequestingMessage,
      createUnrequestingMessage,
      "creating and parsing unrequesting messages"
    ],
    [
      checkCreatingAndParsingResponseMessages,
      startIndexOfBodyInResponse,
      createResponseMessage,
      "creating and parsing response messages"
    ]
  ];

  describeTests(nameOfTest, function() {
    for (const [check, startIndexOfBody, createMessage, name] of checkigFnToCreatingMessageFnAndNameOfTest) {
      const test = createTest(
        check,
        startIndexOfBody,
        messages,
        createMessage,
        extractTypeOfIncomingMessage,
        extractIdOfMessage,
        extractMessageFromMessageWithHeader
      );
      addTest(name, test);
    }

    const testThrowingErrorAtParsing = createTest(
      checkThrowingErrorAtParsing,
      brokenMessage,
      extractTypeOfIncomingMessage
    );

    addTest("throwing error at parsing", testThrowingErrorAtParsing);
  });
};

const createTest = function(check, ...args) {
  return check.bind(null, ...args);
};

module.exports = testMessager;
