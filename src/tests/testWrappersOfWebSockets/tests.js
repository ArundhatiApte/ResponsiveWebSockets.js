"use strict";

const expect = require("assert"),
      Tester = require("tester"),
      W3CWebSocketClient = require("./../../W3CWebSocketClient/W3CWebSocketClient"),
      WebSocketServer = require("./../../ResponsiveWebSocketServer/modules/WebSocketServer/WebSocketServerBasedOnUWS"),
      WebSocketClient = require("./../../ResponsiveWebSocketClient/modules/WebSocketClient");

const tester = new Tester("testing web sockets");
const port = 8088;

let server,
    connectionToClient,
    client;

tester.onBeforeAllTestsStarted.addListener(function createConnections() {
  return new Promise(async function(resolve, reject) {
    server = new WebSocketServer();
    try {
      await server.listen(port);
    } catch(error) {
      return reject(error);
    }
    
    WebSocketClient.setWebSocketClientClass(W3CWebSocketClient);
    client = new WebSocketClient();
    
    server.onConnectionCreated = async function(connection) {
      console.log("connection created, url: ", connection.url);
      try {
        await connectingClient;
      } catch(error) {
        return reject(error);
      }
      connectionToClient = connection;
      resolve();
    };
    let connectingClient;
    try {
      connectingClient = client.connect("ws://127.0.0.1:" + port + "/room/1234");
    } catch(error) {
      reject(error);
    }
  });
});

const checkSendingBinaryMessages = require("./checks/checkSendingBinaryMessages"),
      checkSendingTextMessages = require("./checks/checkSendingTextMessages");

const execTestFromServerToClient = function(check) {
  return check(connectionToClient, client);
};

const execTestFromClientToServer = function(check) {
  return check(client, connectionToClient);
};

tester.addTest(execTestFromServerToClient.bind(null, checkSendingBinaryMessages), {
  name: "sending binary messages from server to client"
});

tester.addTest(execTestFromClientToServer.bind(null, checkSendingBinaryMessages), {
  name: "sending binary messages from client to server"
});

tester.addTest(execTestFromServerToClient.bind(null, checkSendingTextMessages), {
  name: "sending text messages from server to client"
});

tester.addTest(execTestFromClientToServer.bind(null, checkSendingTextMessages), {
  name: "sending text messages from client to server"
});

tester.onAllTestsEnded.addListener(async function closeServerAndConnections() {
  for (const closabe of [server, connectionToClient, client]) {
    closabe.close();
  }
});

tester.run();
