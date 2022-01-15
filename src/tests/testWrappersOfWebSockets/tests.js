"use strict";

const expect = require("assert"),
      Tester = require("tester"),
      utils = require("stuff"),
      W3CWebSocketClient = require("./../../W3CWebSocketClient/W3CWebSocketClient"),
      WebSocketServer = require("./../../ResponsiveWebSocketServer/modules/WebSocketServer/WebSocketServerBasedOnUWS"),
      WebSocketClient = require("./../../ResponsiveWebSocketClient/modules/WebSocketClient");
      
const port = 8088;
      
const getConnectionToClientAndClient = (function() {
  const server = new WebSocketServer();
  
  WebSocketClient.setWebSocketClientClass(W3CWebSocketClient);
  const client = new WebSocketClient();
  let connectionToClient;
  
  return function() {
    return new Promise(async function (resolve, reject) {
      if (connectionToClient) {
        return resolve({
          server,
          connectionToClient,
          client
        });
      }
      
      await server.listen(port);
      server.onConnectionCreated = async function(connection) {
        console.log("connection created, url: ", connection.url);
        await utils.wait(1000);
        connectionToClient = connection;
        resolve({
          server,
          connectionToClient,
          client
        });
      };
      await client.connect("ws://127.0.0.1:" + port + "/room/1234");
    });
  };
})();

const testConnecting = function() {
  return new Promise(async function (resolve, reject) {
    const maxTimeMSToWaitConnection = 1900;
    const timeoutToConnect = setTimeout(function() {
      return reject(new Error("Время ожидания подключения истекло."));
    }, maxTimeMSToWaitConnection);
    
    await getConnectionToClientAndClient();
    clearTimeout(timeoutToConnect);
    resolve();
  });
};

const checkSendingBinaryMessages = require("./checks/checkSendingBinaryMessages"),
      checkSendingTextMessages = require("./checks/checkSendingTextMessages");

const tester = new Tester("testing web sockets");

tester.addTest(testConnecting);
  
{
  const createTestFromServerToClient = (function() {
    const testSendingMessagesFormServerToClient =  async function(checkSendingMessages) {
      const {
        connectionToClient,
        client
      } = await getConnectionToClientAndClient();
      await checkSendingMessages(connectionToClient, client);
    };
    
    return function(checkSendingMessages) {
      return testSendingMessagesFormServerToClient.bind(null, checkSendingMessages);
    };
  })();
  
  const createTestFromClientToServer = (function() {
    const testSendingMessagesFromClientToServer = async function(checkSendingMessages) {
      const {
        connectionToClient,
        client
      } = await getConnectionToClientAndClient();
      await checkSendingMessages(client, connectionToClient);
    };
    
    return function(checkSendingMessages) {
      return testSendingMessagesFromClientToServer.bind(null, checkSendingMessages);
    };
  })();
  
  const checkToName = [
    [checkSendingBinaryMessages, "checkSendingBinaryMessages"],
    [checkSendingTextMessages, "checkSendingTextMessages"]
  ];

  const addTestsFromCheck = function(tester, checkSendingMessages, nameOfCheck) {
    const testSendingMessagesFromServer = createTestFromServerToClient(checkSendingMessages),
          testSendingMessagesFromClient = createTestFromClientToServer(checkSendingMessages),
          nameOfTestFromServer = createNameOfTest(nameOfCheck, "FromServerToClient"),
          nameOfTestFromClient = createNameOfTest(nameOfCheck, "FromClientToServer");

    tester.addTest(testSendingMessagesFromServer, {name: nameOfTestFromServer});
    tester.addTest(testSendingMessagesFromClient, {name: nameOfTestFromClient});
  };

  const countOfLetersInCheck = "check".length;
  const createNameOfTest = function(nameOfCheck, postfix) {
    return "test" + nameOfCheck.slice(countOfLetersInCheck) + postfix;
  };
  
  for (const [check, name] of checkToName) {
    addTestsFromCheck(tester, check, name);
  }
}

tester.onAllTestsEnded.addListener(async function closeServerAndConnections() {
  const {
    server,
    connectionToClient,
    client
  } = await getConnectionToClientAndClient();

  for (const closabe of [server, connectionToClient, client]) {
    closabe.close();
  }
});

tester.run();
