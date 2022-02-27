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

const checkClosingConnections = require("./checks/checkClosingConnections");

const executeTests = function(nameOfTest, server, createConnectionToClientAndClient) {
  return createTester(nameOfTest, server, createConnectionToClientAndClient).run();
};

const createTester = function(nameOfTest, server, createConnectionToClientAndClient) {
  const tester = new Tester(nameOfTest);
  
  let connectionToClient, client;
    
  tester.onBeforeAllTestsStarted.addListener(async function() {
    const cons = await createConnectionToClientAndClient();
    connectionToClient = cons.connectionToClient;
    client = cons.client;
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

  addSendingMessagesTestsToTester(tester, createFnToTestFromServerToClient, createFnToTestFromClientToServer);
  addClosingConnectionTestsToTester(tester, createConnectionToClientAndClient);
  
  return tester;
};

const runTest = function(check, sender, recivier) {
  return check(sender, recivier);
};

const addSendingMessagesTestsToTester = function(
  tester, createFnToTestFromServerToClient, createFnToTestFromClientToServer
) {
  const checkToNameOfTest = [
    [checkSendingAwaitingResponseBinaryMessages, "sending awaiting response binary messages"],
    [checkSendingUnrequestingBinaryMessages, "sending unrequesting binary messages"],
    [checkSendingAwaitingResponseTextMessages, "sending awaiting response text messages"],
    [checkSendingUnrequestingTextMessages, "sending unrequesting text messages"],
    
    [checkSendingManyBinaryMessagesAtOnce, "sending many binary messages at once"],
    [checkSendingManyTextMessagesAtOnce, "sending many text messages at once"],
    
    [checkTimeouts, "timeouts"],
    [
      checkSendingTextResponseOnBinaryAndBinaryResponseOnTextMessages,
      "sending text response on binary and binary response on text messages"
    ]
  ];

  for (const [check, nameOfTest] of checkToNameOfTest) {
    addTestFormOneSideToAnotherToTester(
      tester, check, nameOfTest, createFnToTestFromServerToClient, " from server to client");
    addTestFormOneSideToAnotherToTester(
      tester, check, nameOfTest, createFnToTestFromClientToServer, " from client to server");
  }
  
};

const addTestFormOneSideToAnotherToTester = function(
  tester, check, nameOfTest, createFnToTestOneSideToAnother, postfixOfTestName
) {
  const test = createFnToTestOneSideToAnother(check),
        name = nameOfTest + postfixOfTestName;
  tester.addTest(test, {name});
};

const addClosingConnectionTestsToTester = (function () {
  const addClosingConnectionTestsToTester = function(tester, createConnectionToClientAndClient) {
    tester.addTest(
      createFnToCheckClosingConnectionAndCloseIfFail(createConnectionToClientAndClient, "client", "connectionToClient"),
      {name: "closing connection by client"}
    );
    tester.addTest(
      createFnToCheckClosingConnectionAndCloseIfFail(createConnectionToClientAndClient, "connectionToClient" , "client"),
      {name: "closing connection by server"}
    );
  };

  const createFnToCheckClosingConnectionAndCloseIfFail = function(
    createConnectionToClientAndClient,
    closingSide,
    acceptingSide
  ) {
    return executeTestAndCloseConnectionsIfFail.bind(null, createConnectionToClientAndClient, closingSide, acceptingSide);
  };

  const executeTestAndCloseConnectionsIfFail = async function(
    createConnectionToClientAndClient,
    closingSide,
    acceptingSide
  ) {
    const cons = await createConnectionToClientAndClient();
    const closer = cons[closingSide],
          acceptor = cons[acceptingSide]
    try {
      await checkClosingConnections(closer, acceptor);
    } catch(error) {
      closer.close();
      throw error;
    }
  };
  
  return addClosingConnectionTestsToTester;
})();

module.exports = executeTests;
