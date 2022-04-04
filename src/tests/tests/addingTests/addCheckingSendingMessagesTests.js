"use strict";

const {
  checkSendingManyBinaryMessagesAtOnce,
  checkSendingManyTextMessagesAtOnce
} = require("./../checks/checkSendingManyMessagesAtOnce");

const {
  checkSendingAwaitingResponseBinaryMessages,
  checkSendingUnrequestingBinaryMessages,
  checkSendingAwaitingResponseTextMessages,
  checkSendingUnrequestingTextMessages
} = require("./../checks/checkSendingMessages");

const checkSendingTextResponseOnBinaryAndBinaryResponseOnTextMessages =
  require("./../checks/checkSendingTextResponseOnBinaryAndBinaryResponseOnTextMessages");

const checkTimeouts = require("./../checks/checkTimeouts");

const {
  checkSendingFragmentsOfRequest: {
    checkSendingFragmentsOfBinaryRequest,
    checkSendingFragmentsOfTextRequest
  },
  checkSendingFragmentsOfUnrequestingMessage: {
    checkSendingFragmentsOfUnrequestingBinaryMessage,
    checkSendingFragmentsOfUnrequestingTextMessage
  }
} = require("./../checks/checkSendingFragmentsOfMessages");

const fromServerToClientPostfix = " from server to client";
const fromClientToServerPostfix = " from client to server";

const addCheckingSendingMessagesTests = function(
  tester, createFnToTestFromServerToClient, createFnToTestFromClientToServer
) {
  add2SidesTests(tester, createFnToTestFromServerToClient, createFnToTestFromClientToServer);
  addTestsFromServer(tester, createFnToTestFromServerToClient);
};

const add2SidesTests = function(tester, createFnToTestFromServerToClient, createFnToTestFromClientToServer) {
  const checkToNameOfTest = [
    [checkSendingAwaitingResponseBinaryMessages, "send awaiting response binary messages"],
    [checkSendingUnrequestingBinaryMessages, "send unrequesting binary messages"],
    [checkSendingAwaitingResponseTextMessages, "send awaiting response text messages"],
    [checkSendingUnrequestingTextMessages, "send unrequesting text messages"],
    
    [checkSendingManyBinaryMessagesAtOnce, "send many binary messages at once"],
    [checkSendingManyTextMessagesAtOnce, "send many text messages at once"],
    
    [checkTimeouts, "timeouts"],
    [
      checkSendingTextResponseOnBinaryAndBinaryResponseOnTextMessages,
      "send text response on binary and binary response on text messages"
    ]
  ];

  for (const [check, nameOfTest] of checkToNameOfTest) {
    addTestFormOneSideToAnotherToTester(
      tester, check, nameOfTest, createFnToTestFromServerToClient, fromServerToClientPostfix);
    addTestFormOneSideToAnotherToTester(
      tester, check, nameOfTest, createFnToTestFromClientToServer, fromClientToServerPostfix);
  }
};

const addTestFormOneSideToAnotherToTester = function(
  tester, check, nameOfTest, createFnToTestOneSideToAnother, postfixOfTestName
) {
  const test = createFnToTestOneSideToAnother(check),
        name = nameOfTest + postfixOfTestName;
  tester.addTest(test, {name});
};

const addTestsFromServer = function(tester, createFnToTestFromServerToClient) {
  const checkToNameOfTest = [
    [checkSendingFragmentsOfBinaryRequest, "send fragments of binary request"],
    [checkSendingFragmentsOfTextRequest, "send fragments of text request"],
    [checkSendingFragmentsOfUnrequestingBinaryMessage, "send fragments of unrequesting binary message"],
    [checkSendingFragmentsOfUnrequestingTextMessage, "send fragments of unrequesting text message"]
  ];

  for (const [check, nameOfTest] of checkToNameOfTest) {
    addTestFormOneSideToAnotherToTester(
      tester,
      check,
      nameOfTest,
      createFnToTestFromServerToClient,
      fromServerToClientPostfix
    );
  }
};

module.exports = addCheckingSendingMessagesTests;
