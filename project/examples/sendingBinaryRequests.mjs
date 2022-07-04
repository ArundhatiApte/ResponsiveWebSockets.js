"use strict";

import uWebSockets from "uWebSockets.js";

import ResponsiveWebSocketServer from "./../src/Server/ResponsiveWebSocketServer.js";
import W3CWebSocketClient from "./../src/W3CWebSocketClient.js";
import ResponsiveWebSocketClient from "./../src/Client/ResponsiveWebSocketClient.js";

(async function() {
  ResponsiveWebSocketServer.setUWebSockets(uWebSockets);
  const server = new ResponsiveWebSocketServer({server: new uWebSockets.App({})});
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
    const connectingClient = client.connect("ws://127.0.0.1:" + port + "/room/12345");
  });

  {
    console.log("sending binary request from server");

    client.setBinaryRequestListener(function(messageWithHeader, startIndex, responseSender) {
      console.log("binary request to client: ", new Uint8Array(messageWithHeader, startIndex));

      const sizeOfHeader = client.sizeOfHeaderForBinaryResponse;
      const sizeOfBody = 4;
      const response = new ArrayBuffer(sizeOfHeader + sizeOfBody);
      new DataView(response).setInt32(sizeOfHeader, 123456);
      responseSender.sendBinaryResponse(response);
    });

    const message = new Uint8Array([11, 22, 33, 44]);
    const binaryResponse = await connectionToClient.sendBinaryRequest(message);
    console.log("binary response from client: ", new Uint8Array(
      binaryResponse,
      connectionToClient.startIndexOfBodyInBinaryResponse
    ));
  }
  {
    console.log("\nsending binary request from client");

    connectionToClient.setBinaryRequestListener(function(messageWithHeader, startIndex, responseSender) {
      console.log("binary request to server: ", new Uint8Array(messageWithHeader, startIndex));

      const response = new ArrayBuffer(4);
      new DataView(response).setInt32(0, 123456);
      responseSender.sendBinaryResponse(response);
    });

    const sizeOfHeader = client.sizeOfHeaderForBinaryRequest;
    const sizeOfBody = 4;
    const message = new ArrayBuffer(sizeOfHeader + sizeOfBody);
    const startIndex = sizeOfHeader;
    const uint8sOfBody = new Uint8Array(message, startIndex);
    uint8sOfBody[0] = 11;
    uint8sOfBody[1] = 22;
    uint8sOfBody[2] = 33;
    uint8sOfBody[3] = 44;

    const binaryResponse = await client.sendBinaryRequest(message);
    console.log("binary response from server: ", new Uint8Array(
      binaryResponse,
      client.startIndexOfBodyInBinaryResponse
    ));
  }

  connectionToClient.terminate();
  client.terminate();
  await server.close();
})();
