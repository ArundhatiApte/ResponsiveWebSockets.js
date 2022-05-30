"use strict";

const {
  checkSendingBinaryRequests: {
    checkSendingBinaryRequestsByServer,
    checkSendingBinaryRequestsByClient,
  },
  checkSendingUnrequestingBinaryMessages: {
    checkSendingUnrequestingBinaryMessagesByServer,
    checkSendingUnrequestingBinaryMessagesByClient
  }
} = require("./../checks/checkSendingMessages/checkSendingMessages");

const {
  checkSendingManyBinaryRequestsAtOnceByServer,
  checkSendingManyBinaryRequestsAtOnceByClient
} = require("./../checks/checkSendingMessages/checkSendingManyRequestsAtOnce");

const {
  checkTimeoutByServer,
  checkTimeoutByClient
} = require("./../checks/checkSendingMessages/checkTimeout");

const {
  checkSendingMalformedBinaryMessagesByServerToClient,
  checkSendingTextMessagesByServerToClient,

  checkSendingMalformedBinaryMessagesByClientToServer,
  checkSendingTextMessagesByClientToServer
} = require("./../checks/checkSendingMessages/checkSendingMalformedMessages");

const {
  checkSendingFragmentsOfBinaryRequestByServer,
  checkSendingFragmentsOfBinaryResponseByServer,
  checkSendingFragmentsOfUnrequestingBinaryMessageByServer
} = require("./../checks/checkSendingMessages/checkSendingFragmentsOfMessages");

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
      [
        checkSendingBinaryRequestsByServer,
        checkSendingBinaryRequestsByClient,
        "send awaiting response binary messages"
      ],
      [
        checkSendingUnrequestingBinaryMessagesByServer,
        checkSendingUnrequestingBinaryMessagesByClient,
        "send unrequesting binary messages"
      ]
    ]);

    describeTests("timeouts", function() {
      add2SidesTests(addTest, createFnToTestFromServerToClient, createFnToTestFromClientToServer, [
        [checkTimeoutByServer, checkTimeoutByClient, "timeout to receive response on request"]
      ]);
    });

    add2SidesTests(addTest, createFnToTestFromServerToClient, createFnToTestFromClientToServer, [
      [
        checkSendingMalformedBinaryMessagesByServerToClient,
        checkSendingMalformedBinaryMessagesByClientToServer,
        "send malformed binary messages"
      ]
    ]);
    add2SidesTests(addTest, createFnToTestFromServerToClient, createFnToTestFromClientToServer, [
      [
        checkSendingTextMessagesByServerToClient,
        checkSendingTextMessagesByClientToServer,
        "send text messages"
      ]
    ]);

    describeTests("sending many requests at once", function() {
      const maxTimeMsToSendMessages = 4000;
      this.timeout(maxTimeMsToSendMessages);
      this.slow(maxTimeMsToSendMessages);

      add2SidesTests(addTest, createFnToTestFromServerToClient, createFnToTestFromClientToServer, [
        [
          checkSendingManyBinaryRequestsAtOnceByServer,
          checkSendingManyBinaryRequestsAtOnceByClient,
          "send many binary requests at once"
        ]
      ]);
    });

    addTestsFromServer(addTest, createFnToTestFromServerToClient);
    addTest("send fragments of binary response by server to client", createFnToTestFromClientToServer(
      checkSendingFragmentsOfBinaryResponseByServer
    ));
  });
};

const add2SidesTests = function(
  addTest,
  createFnToTestFromServerToClient,
  createFnToTestFromClientToServer,
  checkToNameOfTest
) {
  for (const [checkAtServer, checkAtClient, nameOfTest] of checkToNameOfTest) {
    addTestFormOneSideToAnotherToTester(
      addTest,
      checkAtServer,
      nameOfTest,
      createFnToTestFromServerToClient,
      fromServerToClientPostfix
    );
    addTestFormOneSideToAnotherToTester(
      addTest,
      checkAtClient,
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

const addTestsFromServer = function(addTest, createFnToTestFromServerToClient) {
  const checkToNameOfTest = [
    [checkSendingFragmentsOfBinaryRequestByServer, "send fragments of binary request"],
    [checkSendingFragmentsOfUnrequestingBinaryMessageByServer, "send fragments of unrequesting binary message"]
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

module.exports = addCheckingSendingMessagesTests;
