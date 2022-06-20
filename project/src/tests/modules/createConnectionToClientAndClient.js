"use strict";

const createConnectionToClientAndClient = function(responsiveWebSocketServer, urlOfServer, ResponsiveWebSocketClient) {
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

module.exports = createConnectionToClientAndClient;
