"use strict";

const Tester = require("tester");

const addCheckingUpgradingConnetionTests = require("./addingTests/addCheckingUpgradingConnetionTests");
const addCheckingSendingMessagesTests = require("./addingTests/addCheckingSendingMessagesTests");
const addCheckingClosingConnectionTests = require("./addingTests/addCheckingClosingConnectionTests");

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

module.exports = createTester;
