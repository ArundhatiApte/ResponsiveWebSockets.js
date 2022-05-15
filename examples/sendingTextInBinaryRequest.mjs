"use strict";

import ResponsiveWebSocketServer from "./../src/Server/ResponsiveWebSocketServer.js";
import W3CWebSocketClient from "./../src/W3CWebSocketClient.js";
import ResponsiveWebSocketClient from "./../src/Client/ResponsiveWebSocketClient.js";

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
    const connectingClient = client.connect("ws://127.0.0.1:" + port + "/room/12345");
  });

  const nameOfEncoding = "utf-8";
  const textEncoder = new TextEncoder(nameOfEncoding);
  const textDecoder = new TextDecoder(nameOfEncoding);

  {
    console.log("sending text in binary request from server");

    client.setBinaryRequestListener(function(messageWithHeader, startIndex, responseSender) {
      const textInRequest = textDecoder.decode(new Uint8Array(messageWithHeader, startIndex));
      console.log("text in binary request to client: ", textInRequest);

      const stringMessage = "aloha";
      const byteSizeOfStingMessage = 5;
      const sizeOfHeader = client.sizeOfHeaderForBinaryResponse;
      const message = new ArrayBuffer(sizeOfHeader + byteSizeOfStingMessage);

      const startIndexOfText = sizeOfHeader;
      textEncoder.encodeInto(stringMessage, new Uint8Array(message, startIndexOfText));
      responseSender.sendBinaryResponse(message);
    });

    const message = textEncoder.encode("hello");
    const binaryResponse = await connectionToClient.sendBinaryRequest(message);

    const textInResponse = textDecoder.decode(new Uint8Array(
      binaryResponse,
      connectionToClient.startIndexOfBodyInBinaryResponse
    ));
    console.log("text in binary response from client: ", textInResponse);
  }
  {
    console.log("\nsending text in binary request from client");

    connectionToClient.setBinaryRequestListener(function(messageWithHeader, startIndex, responseSender) {
      const textInRequest = textDecoder.decode(new Uint8Array(messageWithHeader, startIndex));
      console.log("text in binary request to server: ", textInRequest);

      responseSender.sendBinaryResponse(textEncoder.encode("aloha"));
    });

    const stringMessage = "hello";
    const byteSizeOfStingMessage = 5;
    const sizeOfHeader = client.sizeOfHeaderForBinaryRequest;
    const message = new ArrayBuffer(sizeOfHeader + byteSizeOfStingMessage);

    const startIndex = sizeOfHeader;
    textEncoder.encodeInto(stringMessage, new Uint8Array(message, startIndex));

    const binaryResponse = await client.sendBinaryRequest(message);

    const textInResponse = textDecoder.decode(new Uint8Array(
      binaryResponse,
      client.startIndexOfBodyInBinaryResponse
    ));
    console.log("binary response from server: ", textInResponse);
  }

  connectionToClient.terminate();
  client.terminate();
  await server.close();
})();

