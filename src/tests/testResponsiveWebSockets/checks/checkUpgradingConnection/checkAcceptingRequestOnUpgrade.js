 "use strict";

const checkAcceptingRequestOnUpgrade = function(webSocketServer, urlOfServer, WebSocketClient) {
  return new Promise(function(resolve, reject) {
    const userData = {some: "foo"};

    webSocketServer.setUpgradeListener(function(request, acceptor) {
      return acceptor.acceptConnection(userData);
    });
    webSocketServer.setConnectionListener(function(connectionToClient) {
      if (connectionToClient.userData.some === "foo") {
        resolve();
      } else {
        reject(new Error("Different user data."));
      }
    });
    const client = new WebSocketClient();
    client.connect(urlOfServer);
  });
};

module.exports = checkAcceptingRequestOnUpgrade;
