"use strict";

const isLittleEndian = require(
  "./../../common/ResponsiveWebSocketConnection/modules/messaging/binaryMessages/isLittleEndian"
);
const ResponsiveWebSocketServer = require("./../../Server/ResponsiveWebSocketServer.js");

const server = new ResponsiveWebSocketServer({url: "/*"});
const port = 4443;

const setupSendersOfResponsesOnConnection = function(connectionToClient) {
  console.log("connection url: ", connectionToClient.url);
  connectionToClient.setBinaryRequestListener(sendMultipliedX4Int32);
};

server.setConnectionListener(setupSendersOfResponsesOnConnection);

const sendMultipliedX4Int32 = function(bytesWithHeader, startIndex, senderOfResponse) {
  const int32 = new DataView(bytesWithHeader).getInt32(startIndex, isLittleEndian),
        response = new ArrayBuffer(4);

  new DataView(response).setInt32(0, int32 * 4, isLittleEndian);
  console.log("int32 response: ", response);
  senderOfResponse.sendBinaryResponse(response);
};

server.listen(port);
