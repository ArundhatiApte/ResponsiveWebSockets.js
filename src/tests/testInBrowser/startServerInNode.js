"use strict";

const ResponsiveWebSocketServer = require("./../../Server/ResponsiveWebSocketServer.js");

const server = new ResponsiveWebSocketServer({url: "/*"}),
      port = 4443;

const setupSendersOfResponsesOnConnection = function(connectionToClient) {
  console.log("connection url: ", connectionToClient.url);
  connectionToClient.setBinaryRequestListener(sendMultipliedX4Int32);
  connectionToClient.setTextRequestListener(sendTextInUpperCase);
};

server.setConnectionListener(setupSendersOfResponsesOnConnection);

const sendMultipliedX4Int32 = function(
  bytesWithHeader, startIndex, senderOfResponse
) {
  let dataView = new DataView(bytesWithHeader);
  const int32 = dataView.getInt32(startIndex),
        response = new ArrayBuffer(4);
  
  dataView = new DataView(response);
  dataView.setInt32(0, int32 * 4);
  console.log("int32 response: ", response);
  senderOfResponse.sendBinaryResponse(response);
};

const sendTextInUpperCase = function(text, startIndex, senderOfResponse) {
  const body = text.slice(startIndex),
        response = body.toUpperCase();
  console.log(response);
  senderOfResponse.sendTextResponse(response);
};

server.listen(port);
