"use strict";

const Tester = require("tester");

const checkCreatingAndParsingAwaitingResponseMessages =
  require("./checks/checkCreatingAndParsingAwaitingResponseMessages");

const checkCreatingAndParsingUnrequestingMessages =
  require("./checks/checkCreatingAndParsingUnrequestingMessages");

const checkCreatingAndParsingResponseMessages =
  require("./checks/checkCreatingAndParsingResponseMessages");

const createCheckingThrowingExeptionAtParsingFn =
  require("./checks/createCheckingThrowingExeptionAtParsingFn");

const testMessager = function(options) {
  return createTester(options).run();
};

const createTester = function(options) {
  const {
    nameOfTest,
    messages,
    createAwaitingResponseMessage,
    createUnrequestingMessage,
    createResponseMessage,
    parseMessage,
    extractMessageFromMessageWithHeader,
    brokenMessage
  } = options;

  const tester = new Tester(nameOfTest);

  const checkigFnToCreatingMessageFnAndNameOfTest = [
    [
      checkCreatingAndParsingAwaitingResponseMessages,
      createAwaitingResponseMessage,
      "checkCreatingAndParsingAwaitingResponseMessages"
    ],
    [
      checkCreatingAndParsingUnrequestingMessages,
      createUnrequestingMessage,
      "testCreatingAndParsingUnResponsedMessages"
    ],
    [
      checkCreatingAndParsingResponseMessages,
      createResponseMessage,
      "testCreatingAndParsingResponseMessages"
    ]
  ];

  const createTest = function(
    check, messages, createMessage, parseMessage, extractMessageFromMessageWithHeader
  ) {
    return function() {
      return check(messages, createMessage,
        parseMessage, extractMessageFromMessageWithHeader);
    };
  };
  
  for (const [check, createMessage, name] of checkigFnToCreatingMessageFnAndNameOfTest) {
    const test = createTest(check, messages, createMessage, parseMessage, extractMessageFromMessageWithHeader);
    tester.addTest(test, {name});
  }

  const testThrowingExeptionAtParsing = createCheckingThrowingExeptionAtParsingFn(
    brokenMessage, parseMessage);

  tester.addTest(testThrowingExeptionAtParsing);
  return tester;
};

module.exports = testMessager;
