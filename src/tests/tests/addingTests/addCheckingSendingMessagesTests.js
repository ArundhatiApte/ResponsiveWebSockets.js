"use strict";

const {
  checkSendingManyBinaryRequestsAtOnce,
  checkSendingManyTextRequestsAtOnce
} = require("./../checks/checkSendingManyRequestsAtOnce");

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
  checkSendingFragmentsOfResponse: {
    checkSendingFragmentsOfBinaryResponse,
    checkSendingFragmentsOfTextResponse
  },
  checkSendingFragmentsOfUnrequestingMessage: {
    checkSendingFragmentsOfUnrequestingBinaryMessage,
    checkSendingFragmentsOfUnrequestingTextMessage
  }
} = require("./../checks/checkSendingFragmentsOfMessages");

const {
  checkSendingMalformedBinaryMessagesFromServerToClient,
  checkSendingMalformedTextMessagesFromServerToClient,
  checkSendingMalformedBinaryMessagesFromClientToServer,
  checkSendingMalformedTextMessagesFromClientToServer
} = require("./../checks/checkSendingMalformedMessages");

const fromServerToClientPostfix = " by server to client";
const fromClientToServerPostfix = " by client to server";

const addCheckingSendingMessagesTests = function(
  tester, createFnToTestFromServerToClient, createFnToTestFromClientToServer
) {
  add2SidesTests(tester, createFnToTestFromServerToClient, createFnToTestFromClientToServer);
  addTestsFromServer(tester, createFnToTestFromServerToClient);
  addTestsFromClient(tester, createFnToTestFromClientToServer);
};

const add2SidesTests = function(tester, createFnToTestFromServerToClient, createFnToTestFromClientToServer) {
  const checkToNameOfTest = [
    [checkSendingAwaitingResponseBinaryMessages, "send awaiting response binary messages"],
    [checkSendingUnrequestingBinaryMessages, "send unrequesting binary messages"],
    [checkSendingAwaitingResponseTextMessages, "send awaiting response text messages"],
    [checkSendingUnrequestingTextMessages, "send unrequesting text messages"],

    [checkSendingManyBinaryRequestsAtOnce, "send many binary requests at once"],
    [checkSendingManyTextRequestsAtOnce, "send many text requests at once"],

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
  addCheckingSendingBrokenMessagesTests(tester, createFnToTestFromServerToClient, createFnToTestFromClientToServer);
};

const addTestFormOneSideToAnotherToTester = function(
  tester, check, nameOfTest, createFnToTestOneSideToAnother, postfixOfTestName
) {
  const test = createFnToTestOneSideToAnother(check),
        name = nameOfTest + postfixOfTestName;
  tester.addTest(test, {name});
};

const addCheckingSendingBrokenMessagesTests = function(
  tester,
  createFnToTestFromServerToClient,
  createFnToTestFromClientToServer
) {
  tester.addTest(createFnToTestFromServerToClient(checkSendingMalformedBinaryMessagesFromServerToClient), {
    name: "send malformed binary messages by server to client"
  });
  tester.addTest(createFnToTestFromServerToClient(checkSendingMalformedTextMessagesFromServerToClient), {
    name: "send malformed text messages by server to client"
  });
  tester.addTest(createFnToTestFromClientToServer(checkSendingMalformedBinaryMessagesFromClientToServer), {
    name: "send malformed binary messages by client to server"
  });
  tester.addTest(createFnToTestFromClientToServer(checkSendingMalformedTextMessagesFromClientToServer), {
    name: "send malformed text messages by client to server"
  });
}

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

const addTestsFromClient = function(tester, createFnToTestFromClientToServer) {
  const checkToNameOfTest = [
    [checkSendingFragmentsOfBinaryResponse, "send fragments of binary response by server to client"],
    [checkSendingFragmentsOfTextResponse, "send fragments of text response by server to client"]
  ];
  for (const [check, name] of checkToNameOfTest) {
    tester.addTest(createFnToTestFromClientToServer(check), {name});
  }
};

module.exports = addCheckingSendingMessagesTests;
