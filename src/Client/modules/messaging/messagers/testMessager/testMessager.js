"use strict";

const Tester = require("tester");

const checkCreatingAndParsingAwaitingResponseMessages =
  require("./checks/checkCreatingAndParsingAwaitingResponseMessages");

const checkCreatingAndParsingUnrequestingMessages =
  require("./checks/checkCreatingAndParsingUnrequestingMessages");

const checkCreatingAndParsingResponseMessages =
  require("./checks/checkCreatingAndParsingResponseMessages");

const checkThrowingExceptionAtParsing =
  require("./checks/checkThrowingExceptionAtParsing");

const testMessager = function(options) {
  return createTester(options).run();
};

const createTester = function(options) {
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

  const tester = new Tester(nameOfTest);

  const checkigFnToCreatingMessageFnAndNameOfTest = [
    [
      checkCreatingAndParsingAwaitingResponseMessages,
      startIndexOfBodyInRequest,
      createRequestMessage,
      "test creating and parsing awaiting response messages"
    ],
    [
      checkCreatingAndParsingUnrequestingMessages,
      startIndexOfBodyInUnrequestingMessage,
      createUnrequestingMessage,
      "test creating and parsing unrequesting messages"
    ],
    [
      checkCreatingAndParsingResponseMessages,
      startIndexOfBodyInResponse,
      createResponseMessage,
      "test creating and parsing response messages"
    ]
  ];
  
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
    tester.addTest(test, {name});
  }

  const testThrowingExceptionAtParsing = createTest(
    checkThrowingExceptionAtParsing,
    brokenMessage,
    extractTypeOfIncomingMessage
  );

  tester.addTest(testThrowingExceptionAtParsing);
  return tester;
};

const createTest = function(check, ...args) {
  return check.bind(null, ...args);
};

module.exports = testMessager;
