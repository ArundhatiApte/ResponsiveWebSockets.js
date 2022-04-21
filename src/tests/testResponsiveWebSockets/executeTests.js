"use strict";

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
      responsiveWebSocketServer.close();
      connectionToClient.terminate();
      client.terminate();
      setTimeout(process.exit.bind(process, 0), 10);
    });
  });
};

const _createConnectionToClientAndClient = function(responsiveWebSocketServer, urlOfServer, ResponsiveWebSocketClient) {
  return new Promise(function(resolve, reject) {
    const acceptRequestByDefault = null;
    responsiveWebSocketServer.setUpgradeListener(acceptRequestByDefault);

    responsiveWebSocketServer.setConnectionListener(async function(connectionToClient) {
      await connectingClient;
      resolve({connectionToClient, client});
    });

    const client = new ResponsiveWebSocketClient();
    const connectingClient = client.connect(urlOfServer);
  });
};

const runTest = function(check, sender, receiver) {
  return check(sender, receiver);
};

module.exports = executeTests;
