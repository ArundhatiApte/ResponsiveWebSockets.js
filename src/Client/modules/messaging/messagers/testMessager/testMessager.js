"use strict";

const checkCreatingAndParsingAwaitingResponseMessages =
  require("./checks/checkCreatingAndParsingAwaitingResponseMessages");

const checkCreatingAndParsingUnrequestingMessages =
  require("./checks/checkCreatingAndParsingUnrequestingMessages");

const checkCreatingAndParsingResponseMessages =
  require("./checks/checkCreatingAndParsingResponseMessages");

const checkThrowingExceptionAtParsing =
  require("./checks/checkThrowingExceptionAtParsing");

const testMessager = function(describe, it, options) {
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

  describe(nameOfTest, function() {
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
      it(name, test);
    }

    const testThrowingExceptionAtParsing = createTest(
      checkThrowingExceptionAtParsing,
      brokenMessage,
      extractTypeOfIncomingMessage
    );

    it("throwing error at parsing", testThrowingExceptionAtParsing);
  });
};

const createTest = function(check, ...args) {
  return check.bind(null, ...args);
};

module.exports = testMessager;
