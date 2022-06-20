"use strict";

import ResponsiveWebSocketServer from "./../project/src/Server/ResponsiveWebSocketServer.js";
import W3CWebSocketClient from "./../project/src/W3CWebSocketClient.js";
import ResponsiveWebSocketClient from "./../project/src/Client/ResponsiveWebSocketClient.js";

(async function() {
  const server = new ResponsiveWebSocketServer();
  const port = 4443;

  await server.listen(port);

  ResponsiveWebSocketClient.setWebSocketClientClass(W3CWebSocketClient);
  const client = new ResponsiveWebSocketClient();

  const connectionToClient = await new Promise(function(resolve, reject) {
    server.setConnectionListener(async function(connectionToClient) {
      console.log("connection url: ", connectionToClient.url);
      await connectingClient;
      resolve(connectionToClient);
    });
    const connectingClient = client.connect("ws://127.0.0.1:" + port + "/room/1234");
  });

  {
    client.setUnrequestingBinaryMessageListener(function(messageWithHeader, startIndex) {
      console.log("unrequesting binary message from server: ", new Uint8Array(
        messageWithHeader,
        startIndex
      ));
    });
    const message = new Uint8Array([1, 2, 3, 4]);
    connectionToClient.sendUnrequestingBinaryMessage(message);
  }
  {
    connectionToClient.setUnrequestingBinaryMessageListener(function(messageWithHeader, startIndex) {
      console.log("unrequesting binary message from client: ", new Uint8Array(
        messageWithHeader,
        startIndex
      ));
    });

    const sizeOfHeader = client.sizeOfHeaderForUnrequestingBinaryMessage;
    const sizeOfBody = 4;
    const message = new ArrayBuffer(sizeOfHeader + sizeOfBody);
    const startIndex = sizeOfHeader;
    const uint8sOfBody = new Uint8Array(message, startIndex);
    uint8sOfBody[0] = 1;
    uint8sOfBody[1] = 2;
    uint8sOfBody[2] = 3;
    uint8sOfBody[3] = 4;
    client.sendUnrequestingBinaryMessage(message);
  }

  setTimeout(async function close() {
    connectionToClient.terminate();
    client.terminate();
    await server.close();
  }, 200);
})();
