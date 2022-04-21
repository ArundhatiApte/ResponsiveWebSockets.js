"use strict";

const addCheckingUpgradingConnetionTests = require("./addingTests/addCheckingUpgradingConnetionTests");
const addCheckingSendingMessagesTests = require("./addingTests/addCheckingSendingMessagesTests");
const addCheckingClosingConnectionTests = require("./addingTests/addCheckingClosingConnectionTests");

const executeTests = function(describe, addTest, options) {
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

  describe(nameOfTest, function() {
    this.timeout(6000);

    before(async function() {
      await responsiveWebSocketServer.listen(port);
      const cons = await createConnectionToClientAndClient();
      connectionToClient = cons.connectionToClient;
      client = cons.client;
    });

    addCheckingUpgradingConnetionTests(addTest, responsiveWebSocketServer, urlOfServer, ResponsiveWebSocketClient);
    addCheckingSendingMessagesTests(addTest, createFnToTestFromServerToClient, createFnToTestFromClientToServer);
    addCheckingClosingConnectionTests(addTest, createConnectionToClientAndClient);

    after(function() {
      responsiveWebSocketServer.close();
      connectionToClient.close();
      client.close();
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
