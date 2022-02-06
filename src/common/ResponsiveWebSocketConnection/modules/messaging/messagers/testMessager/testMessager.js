"use strict";

const Tester = require("tester");

const checkCreatingAndParsingAwaitingResponseMessages =
  require("./checks/checkCreatingAndParsingAwaitingResponseMessages");

const checkCreatingAndParsingUnrequestingMessages =
  require("./checks/checkCreatingAndParsingUnrequestingMessages");

const checkCreatingAndParsingResponseMessages =
  require("./checks/checkCreatingAndParsingResponseMessages");

const checkThrowingExeptionAtParsing =
  require("./checks/checkThrowingExeptionAtParsing");

const testMessager = function(options) {
  return createTester(options).run();
};

const createTester = function(options) {
  const {
    nameOfTest,
    messages,
    
    createAwaitingResponseMessage,
    startIndexOfAwaitingResponseMessageBody,
    
    createUnrequestingMessage,
    startIndexOfUnrequestingMessageBody,
    
    createResponseMessage,
    startIndexOfResponseMessageBody,
    
    parseMessage,
    extractMessageFromMessageWithHeader,
    brokenMessage
  } = options;

  const tester = new Tester(nameOfTest);

  const checkigFnToCreatingMessageFnAndNameOfTest = [
    [
      checkCreatingAndParsingAwaitingResponseMessages,
      startIndexOfAwaitingResponseMessageBody,
      createAwaitingResponseMessage,
      "checkCreatingAndParsingAwaitingResponseMessages"
    ],
    [
      checkCreatingAndParsingUnrequestingMessages,
      startIndexOfUnrequestingMessageBody,
      createUnrequestingMessage,
      "testCreatingAndParsingUnResponsedMessages"
    ],
    [
      checkCreatingAndParsingResponseMessages,
      startIndexOfResponseMessageBody,
      createResponseMessage,
      "testCreatingAndParsingResponseMessages"
    ]
  ];
  
  for (const [check, startIndexOfBody, createMessage, name] of checkigFnToCreatingMessageFnAndNameOfTest) {
    const test = createTest(
      check,
      startIndexOfBody,
      messages,
      createMessage,
      parseMessage,
      extractMessageFromMessageWithHeader
    );
    tester.addTest(test, {name});
  }

  const testThrowingExeptionAtParsing = createTest(checkThrowingExeptionAtParsing, brokenMessage, parseMessage);

  tester.addTest(testThrowingExeptionAtParsing);
  return tester;
};

const createTest = function(check, ...args) {
  return check.bind(null, ...args);
};

module.exports = testMessager;
