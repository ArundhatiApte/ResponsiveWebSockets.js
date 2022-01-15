"use strict";

const rootFolder = "./../",
      ResponsiveWebSocketServer = require(rootFolder + "ResponsiveWebSocketServer/ResponsiveWebSocketServer"),
      ResponsiveWebSocketClient = require(rootFolder + "ResponsiveWebSocketClient/ResponsiveWebSocketClient"),
      WebSocketClientFromW3C = require("./../W3CWebSocketClient/W3CWebSocketClient"),
      executeTests = require("./modules/executeTests");

const getConnectionToClientAndClientAndServer = function() {
  return new Promise(async function(resolve, reject) {
    const responsiveServer = new ResponsiveWebSocketServer({url: "/room/*"});
  
    ResponsiveWebSocketClient.setWebSocketClientClass(WebSocketClientFromW3C);
    const responsiveClient = new ResponsiveWebSocketClient(),
          port = 4668,
          url = "ws://127.0.0.1:" + port + "/room/1234";
  
    try {
      await responsiveServer.listen(port);
    } catch(error) {
      return reject(error, new Error("Failed attemp to launch server " + url));
    }

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
   
executeTests(
  "test responsive web socket client and server", 
  getConnectionToClientAndClientAndServer
);
