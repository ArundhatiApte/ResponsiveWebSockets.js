 "use strict";

const checkAcceptingRequestOnUpgrade = function(webSocketServer, urlOfServer, WebSocketClient) {
  return new Promise(function(resolve, reject) {
    const userData = {some: "foo"};

    webSocketServer.setUpgradeListener(function(request, acceptor) {
      return acceptor.acceptConnection(userData);
    });

    webSocketServer.setConnectionListener(function(connectionToClient) {
      if (!isValidInterfaceOfServerConnection(connectionToClient)) {
        return reject(new Error("Invalid interface of ServerConnection."));
      }
      if (connectionToClient.userData.some === "foo") {
        connectionToClient.terminate();
        client.terminate();
        return resolve();
      }
      reject(new Error("Different user data."));
    });
    const client = new WebSocketClient();
    client.connect(urlOfServer);
  });
};

const isValidInterfaceOfServerConnection = function(connectionToClient) {
  return (
    typeof connectionToClient.url === "string" &&
    typeof connectionToClient.getRemoteAddress === "function" &&
    connectionToClient.getRemoteAddress() instanceof ArrayBuffer
  );
};

module.exports = checkAcceptingRequestOnUpgrade;
