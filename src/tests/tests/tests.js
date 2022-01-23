"use strict";

const ResponsiveWebSocketServer = require("./../../ResponsiveWebSocketServer/ResponsiveWebSocketServer"),
      ResponsiveWebSocketClient = require("./../../ResponsiveWebSocketClient/ResponsiveWebSocketClient"),
      WebSocketClientFromW3C = require("./../../W3CWebSocketClient/W3CWebSocketClient"),
      executeTests = require("./executeTests");

ResponsiveWebSocketClient.setWebSocketClientClass(WebSocketClientFromW3C);

const responsiveServer = new ResponsiveWebSocketServer({url: "/room/*"}); 
const port = 4668,
      url = "ws://127.0.0.1:" + port + "/room/1234";

const createConnectionToClientAndClient = function() {
  return new Promise(async function(resolve, reject) {
    const responsiveClient = new ResponsiveWebSocketClient();

    responsiveServer.setConnectionListener(async function(connectionToClient) {
      console.log("web socket url: ", connectionToClient.url);
      await connectingClient;
      resolve({
        connectionToClient,
        client: responsiveClient,
        server: responsiveServer
      });
    });
    const connectingClient = responsiveClient.connect(url);
  });
};

(async function prog() {
  try {
    await responsiveServer.listen(port);
  } catch(error) {
    return console.log("Failed attemp to launch server: " + url, " ", error);
  }
  await executeTests(
    "test responsive web socket client and server",
    responsiveServer,
    createConnectionToClientAndClient
  );
})();
