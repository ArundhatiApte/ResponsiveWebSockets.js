"use strict";

import ResponsiveWebSocketServer from "./../src/Server/ResponsiveWebSocketServer.js";
import W3CWebSocketClient from "./../src/W3CWebSocketClient.js";
import ResponsiveWebSocketClient from "./../src/Client/ResponsiveWebSocketClient.js";

(async function() {
  const server = new ResponsiveWebSocketServer(),
        port = 4443;
  await server.listen(port);

  ResponsiveWebSocketClient.setWebSocketClientClass(W3CWebSocketClient);
  const client = new ResponsiveWebSocketClient();
  const sizeOfClientHeaderForBinaryRequest = client.sizeOfHeaderForBinaryRequest;

  const connectionToClient = await new Promise(function(resolve, reject) {
    server.setConnectionListener(async function(connectionToClient) {
      console.log("connection url: ", connectionToClient.url);
      await connectingClient;
      resolve(connectionToClient);
    });
    const connectingClient = client.connect("ws://127.0.0.1:" + port + "/room/12345");
  });

  {
    const sendCountOfProducts = function(bytes, startIndex, responseSender) {
      const idOfItem = new DataView(bytes).getUint16(startIndex),
            countOfProducts = idOfProductToCount.get(idOfItem);

      const response = new Uint16Array([countOfProducts]);
      responseSender.sendBinaryResponse(response);
    };
    connectionToClient.setBinaryRequestListener(sendCountOfProducts);

    const idOfProductToCount = new Map([
      [1111, 2222],
      [333, 444]
    ]);

    await getCountOfProductsByIdAndLogResult(client, 1111);
    await getCountOfProductsByIdAndLogResult(client, 333);

    async function getCountOfProductsByIdAndLogResult(clientConnection, idOfProduct) {
      const request = new ArrayBuffer(sizeOfClientHeaderForBinaryRequest + 2);
      new DataView(request).setUint16(sizeOfClientHeaderForBinaryRequest, idOfProduct);

      const binaryResponse = await clientConnection.sendBinaryRequest(request);
      const startIndex = clientConnection.startIndexOfBodyInBinaryResponse;
      const count = new DataView(binaryResponse).getUint16(startIndex);
      console.log("Count of products (id: ", idOfProduct, "): ", count);
    }
  }

  connectionToClient.close();
  client.close();
  server.close();
})();
