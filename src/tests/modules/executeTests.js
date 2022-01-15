"use strict";

const Tester = require("tester"),
      checkTimeouts = require("./checks/checkTimeouts");

const {
  checkSendingManyBinaryMessagesAtOnce,
  checkSendingManyTextMessagesAtOnce
} = require("./checks/checkingSendingManyMessagesAtOnce");

const {
  checkSendingAwaitingResponseBinaryMessages,
  checkSendingUnrequestingBinaryMessages,
  checkSendingAwaitingResponseTextMessages,
  checkSendingUnrequestingTextMessages
} = require("./checks/checkSendingMessages");

const checkSendingTextResponseOnBinaryAndBinaryResponseOnTextMessages =
  require("./checks/checkSendingTextResponseOnBinaryAndBinaryResponseOnTextMessages");

const executeTests = function(nameOfTest, getConnectionToClientAndClientAndServer) {
  return createTester(nameOfTest, getConnectionToClientAndClientAndServer).run();
};

const createTester = function(nameOfTest, getConnectionToClientAndClientAndServer) {
  const tester = new Tester(nameOfTest);
    
  let connectionToClient, client, server;
    
  tester.onBeforeAllTestsStarted.addListener(async function() {
    const cons = await getConnectionToClientAndClientAndServer();
    connectionToClient = cons.connectionToClient;
    client = cons.client;
    server = cons.server;
  });

  tester.onAllTestsEnded.addListener(function closeConnections() {
    connectionToClient.close();
    client.close();
    server.close();
  });
  
  const createFnToTestFromServerToClient = function(checkSendingMessages) {
    return function() {
      return runTest(checkSendingMessages, connectionToClient, client);
    };
  };

  const createFnToTestFromClientToServer = function(checkSendingMessages) {
    return function() {
      return runTest(checkSendingMessages, client, connectionToClient);
    };
  };

  addTestsToTester(tester, createFnToTestFromServerToClient, createFnToTestFromClientToServer);

  return tester;
};

const runTest = function(check, sender, recivier) {
  return check(sender, recivier);
};

const addTestsToTester = function(
  tester, createFnToTestFromServerToClient, createFnToTestFromClientToServer
) {
  const checkToNameOfTest = [
    [checkSendingAwaitingResponseBinaryMessages, "testSendingAwaitingResponseBinaryMessages"],
    [checkSendingUnrequestingBinaryMessages, "testSendingUnrequestingBinaryMessages"],
    [checkSendingAwaitingResponseTextMessages, "testSendingAwaitingResponseTextMessages"],
    [checkSendingUnrequestingTextMessages, "testSendingUnrequestingTextMessages"],
    
    [checkSendingManyBinaryMessagesAtOnce, "testSendingManyBinaryMessagesAtOnce"],
    [checkSendingManyTextMessagesAtOnce, "testSendingManyTextMessagesAtOnce"],
    
    [checkTimeouts, "testTimeouts"],
    [
      checkSendingTextResponseOnBinaryAndBinaryResponseOnTextMessages,
      "testSendingTextResponseOnBinaryAndBinaryResponseOnTextMessages"
    ]
  ];

  for (const [check, nameOfTest] of checkToNameOfTest) {
    addTestFormOneSideToAnotherToTester(
      tester, check, nameOfTest, createFnToTestFromServerToClient, "FromServerToClient");
    addTestFormOneSideToAnotherToTester(
      tester, check, nameOfTest, createFnToTestFromClientToServer, "FromClientToServer");
  }
  
};

const addTestFormOneSideToAnotherToTester = function(
  tester, check, nameOfTest, createFnToTestOneSideToAnother, postfixOfTestName
) {
  const test = createFnToTestOneSideToAnother(check),
        name = nameOfTest + postfixOfTestName;
  tester.addTest(test, {name});
};

module.exports = executeTests;
