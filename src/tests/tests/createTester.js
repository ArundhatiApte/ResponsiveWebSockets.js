"use strict";

const Tester = require("tester"),
      checkTimeouts = require("./checksSendingMessages/checkTimeouts");

const {
  checkSendingManyBinaryMessagesAtOnce,
  checkSendingManyTextMessagesAtOnce
} = require("./checksSendingMessages/checkingSendingManyMessagesAtOnce");

const {
  checkSendingAwaitingResponseBinaryMessages,
  checkSendingUnrequestingBinaryMessages,
  checkSendingAwaitingResponseTextMessages,
  checkSendingUnrequestingTextMessages
} = require("./checksSendingMessages/checkSendingMessages");

const checkSendingTextResponseOnBinaryAndBinaryResponseOnTextMessages =
  require("./checksSendingMessages/checkSendingTextResponseOnBinaryAndBinaryResponseOnTextMessages");

const addCheckingUpgradingConnetionTests = require(
  "./addCheckingUpgradingConnetionTests/addCheckingUpgradingConnetionTests"
);
const addCheckingClosingConnectionTests = require(
  "./addCheckingClosingConnectionTests/addCheckingClosingConnectionTests"
);

const createTester = function(options, nameOfTest, server, createConnectionToClientAndClient) {
  const tester = new Tester(options.nameOfTester);
  addTests(tester, options);
  return tester;
};

const addTests = function(tester, options) {
  const {
    responsiveServer,
    urlOfServer,
    port,
    ResponsiveClient
  } = options;
  
  const createConnectionToClientAndClient = _createConnectionToClientAndClient.bind(
    null,
    responsiveServer,
    urlOfServer,
    ResponsiveClient
  );

  let connectionToClient, client;
  tester.onBeforeAllTestsStarted.addListener(async function startServerAndCreateConnections() {
    await responsiveServer.listen(port);
    const cons = await createConnectionToClientAndClient();
    connectionToClient = cons.connectionToClient;
    client = cons.client;
  });
  
  const createFnToTestFromServerToClient = (checkSendingMessages) => () => (
    runTest(checkSendingMessages, connectionToClient, client)
  );

  const createFnToTestFromClientToServer = (checkSendingMessages) => () => (
    runTest(checkSendingMessages, client, connectionToClient)
  );

  addCheckingUpgradingConnetionTests(tester, responsiveServer, urlOfServer, ResponsiveClient);
  addCheckingSendingMessagesTests(tester, createFnToTestFromServerToClient, createFnToTestFromClientToServer);
  addCheckingClosingConnectionTests(tester, createConnectionToClientAndClient);
};

const _createConnectionToClientAndClient = function(responsiveServer, urlOfServer, ResponsiveClient) {
  return new Promise(function(resolve, reject) {
    const acceptRequestByDefault = null;
    responsiveServer.setUpgradeListener(acceptRequestByDefault);
    
    responsiveServer.setConnectionListener(async function(connectionToClient) {
      await connectingClient;
      resolve({connectionToClient, client});
    });

    const client = new ResponsiveClient();
    const connectingClient = client.connect(urlOfServer);
  });
};

const runTest = function(check, sender, recivier) {
  return check(sender, recivier);
};

const addCheckingSendingMessagesTests = function(
  tester, createFnToTestFromServerToClient, createFnToTestFromClientToServer
) {
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

module.exports = createTester;
