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

const checkTimeout = require("./../checks/checkTimeout");

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
  describeTests,
  addTest,
  createFnToTestFromServerToClient,
  createFnToTestFromClientToServer
) {
  return describeTests("sending messages", function() {
    add2SidesTests(addTest, createFnToTestFromServerToClient, createFnToTestFromClientToServer, [
      [checkSendingAwaitingResponseBinaryMessages, "send awaiting response binary messages"],
      [checkSendingUnrequestingBinaryMessages, "send unrequesting binary messages"],

      [checkSendingAwaitingResponseTextMessages, "send awaiting response text messages"],
      [checkSendingUnrequestingTextMessages, "send unrequesting text messages"],

      [
        checkSendingTextResponseOnBinaryAndBinaryResponseOnTextMessages,
        "send text response on binary and binary response on text messages"
      ]
    ]);

    describeTests("timeouts", function() {
      add2SidesTests(
        addTest,
        createFnToTestFromServerToClient,
        createFnToTestFromClientToServer,
        [[checkTimeout, "timeout to receive response on request"]]
      );
    })

    addCheckingSendingBrokenMessagesTests(
      addTest,
      createFnToTestFromServerToClient,
      createFnToTestFromClientToServer
    );

    describeTests("sending many requests at once", function() {
      const maxTimeMsToSendMessages = 6000;
      this.timeout(maxTimeMsToSendMessages);
      this.slow(2300);
      add2SidesTests(addTest, createFnToTestFromServerToClient, createFnToTestFromClientToServer, [
        [checkSendingManyBinaryRequestsAtOnce, "send many binary requests at once"],
        [checkSendingManyTextRequestsAtOnce, "send many text requests at once"]
      ]);
    });

    addTestsFromServer(addTest, createFnToTestFromServerToClient);
    addTestsFromClient(addTest, createFnToTestFromClientToServer);
  });
};

const add2SidesTests = function(
  addTest,
  createFnToTestFromServerToClient,
  createFnToTestFromClientToServer,
  checkToNameOfTest
) {
  for (const [check, nameOfTest] of checkToNameOfTest) {
    addTestFormOneSideToAnotherToTester(
      addTest,
      check,
      nameOfTest,
      createFnToTestFromServerToClient,
      fromServerToClientPostfix
    );
    addTestFormOneSideToAnotherToTester(
      addTest,
      check,
      nameOfTest,
      createFnToTestFromClientToServer,
      fromClientToServerPostfix
    );
  }
};

const addTestFormOneSideToAnotherToTester = function(
  addTest,
  check,
  nameOfTest,
  createFnToTestOneSideToAnother,
  postfixOfTestName
) {
  const name = nameOfTest + postfixOfTestName;
  addTest(name, createFnToTestOneSideToAnother(check));
};

const addCheckingSendingBrokenMessagesTests = function(
  addTest,
  createFnToTestFromServerToClient,
  createFnToTestFromClientToServer
) {
  addTest(
    "send malformed binary messages by server to client",
    createFnToTestFromServerToClient(checkSendingMalformedBinaryMessagesFromServerToClient)
  );
  addTest(
    "send malformed text messages by server to client",
    createFnToTestFromServerToClient(checkSendingMalformedTextMessagesFromServerToClient));
  addTest(
    "send malformed binary messages by client to server",
    createFnToTestFromClientToServer(checkSendingMalformedBinaryMessagesFromClientToServer));
  addTest(
    "send malformed text messages by client to server",
    createFnToTestFromClientToServer(checkSendingMalformedTextMessagesFromClientToServer)
  );
}

const addTestsFromServer = function(addTest, createFnToTestFromServerToClient) {
  const checkToNameOfTest = [
    [checkSendingFragmentsOfBinaryRequest, "send fragments of binary request"],
    [checkSendingFragmentsOfTextRequest, "send fragments of text request"],
    [checkSendingFragmentsOfUnrequestingBinaryMessage, "send fragments of unrequesting binary message"],
    [checkSendingFragmentsOfUnrequestingTextMessage, "send fragments of unrequesting text message"]
  ];

  for (const [check, nameOfTest] of checkToNameOfTest) {
    addTestFormOneSideToAnotherToTester(
      addTest,
      check,
      nameOfTest,
      createFnToTestFromServerToClient,
      fromServerToClientPostfix
    );
  }
};

const addTestsFromClient = function(addTest, createFnToTestFromClientToServer) {
  const checkToNameOfTest = [
    [checkSendingFragmentsOfBinaryResponse, "send fragments of binary response by server to client"],
    [checkSendingFragmentsOfTextResponse, "send fragments of text response by server to client"]
  ];
  for (const [check, name] of checkToNameOfTest) {
    addTest(name, createFnToTestFromClientToServer(check));
  }
};

module.exports = addCheckingSendingMessagesTests;
