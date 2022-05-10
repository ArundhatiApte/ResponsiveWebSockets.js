"use strict";

const _createConnectionToClientAndClient = require("./../modules/createConnectionToClientAndClient");

const addCheckingUpgradingConnetionTests = require("./addingTests/addCheckingUpgradingConnetionTests");
const addCheckingSendingMessagesTests = require("./addingTests/addCheckingSendingMessagesTests");
const addCheckingClosingConnectionTests = require("./addingTests/addCheckingClosingConnectionTests");

const executeTests = function(describeTests, addTest, options) {
  const {
    nameOfTest,
    responsiveWebSocketServer,
    urlOfServer,
    port,
    ResponsiveWebSocketClient
  } = options;

  const createConnectionToClientAndClient = _createConnectionToClientAndClient.bind(
    null,
    responsiveWebSocketServer,
    urlOfServer,
    ResponsiveWebSocketClient
  );

  let connectionToClient, client;

  const createFnToTestFromServerToClient = (checkSendingMessages) => () => (
    runTest(checkSendingMessages, connectionToClient, client)
  );

  const createFnToTestFromClientToServer = (checkSendingMessages) => () => (
    runTest(checkSendingMessages, client, connectionToClient)
  );

  describeTests(nameOfTest, function() {
    before(async function() {
      await responsiveWebSocketServer.listen(port);
      const cons = await createConnectionToClientAndClient();
      connectionToClient = cons.connectionToClient;
      client = cons.client;
    });

    addCheckingUpgradingConnetionTests(
      describeTests,
      addTest,
      responsiveWebSocketServer,
      urlOfServer,
      ResponsiveWebSocketClient
    );
    addCheckingSendingMessagesTests(
      describeTests,
      addTest,
      createFnToTestFromServerToClient,
      createFnToTestFromClientToServer
    );
    addCheckingClosingConnectionTests(describeTests, addTest, createConnectionToClientAndClient);

    after(function() {
      client.terminate();
      connectionToClient.terminate();
      responsiveWebSocketServer.close();
      // setTimeout(process.exit.bind(process, 0), 20);
    });
  });
};

const runTest = function(check, sender, receiver) {
  return check(sender, receiver);
};

module.exports = executeTests;
