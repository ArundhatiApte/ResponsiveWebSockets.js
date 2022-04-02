"use strict";

const checkCancelRequestOnUpgrade = function(webSocketServer, urlOfServer, WebSocketClient) {
  return new Promise(async function(resolve, reject) {
    webSocketServer.setUpgradeListener(function(request, acceptor) {
      return acceptor.cancelConnection();
    });
    webSocketServer.setConnectionListener(function() {
      return reject(new Error("Connection was created."));
    });
    const client = new WebSocketClient();
    await assertFailureAtConnection(client, urlOfServer, reject);
    resolve();
  });
};

const assertFailureAtConnection = async function(client, urlOfServer, reject) {
  try {
    await client.connect(urlOfServer);
  } catch(error) {
    return;
  }
  onError(new Error("Connection was created."));
};

module.exports = checkCancelRequestOnUpgrade;
