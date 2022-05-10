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
  const sizeOfClientHeaderForUnrequestingBinaryMessage = client.sizeOfHeaderForUnrequestingBinaryMessage;

  const connectionToClient = await new Promise(function(resolve, reject) {
    server.setConnectionListener(async function(connectionToClient) {
      console.log("connection url: ", connectionToClient.url);
      await connectingClient;
      resolve(connectionToClient);
    });
    const connectingClient = client.connect("ws://127.0.0.1:" + port + "/room/1234");
  });

  {
    connectionToClient.setUnrequestingBinaryMessageListener(manageShopBasket);

    function manageShopBasket(bytesWithHeader, startIndex) {
      const dataView = new DataView(bytesWithHeader),
            idOfAction = dataView.getUint8(startIndex),
            idOfItem = dataView.getUint16(startIndex + 1);

      if (idOfAction === action.addingItem) {
        console.log("User added new item (id:", idOfItem, ") to basket.");
      } else if (idOfAction === action.removingItem) {
        console.log("User removed item (id:", idOfItem, ") from basket.");
      }
    }

    const action = {addingItem: 1, removingItem: 2};

    let idOfItem = 42;
    sendClientAction(client, action.addingItem, idOfItem);
    sendClientAction(client, action.addingItem, 1200);
    sendClientAction(client, action.removingItem, idOfItem);

    function sendClientAction(clientConnection, idOfAction, idOfItem) {
      const message = new ArrayBuffer(sizeOfClientHeaderForUnrequestingBinaryMessage + 3),
            dataView = new DataView(message),
            startIndex = sizeOfClientHeaderForUnrequestingBinaryMessage;

      dataView.setUint8(startIndex, idOfAction);
      dataView.setUint16(startIndex + 1, idOfItem);
      clientConnection.sendUnrequestingBinaryMessage(message);
    }
  }

  await new Promise(function wait(resolve) {
    return setTimeout(resolve, 200);
  });
  connectionToClient.close();
  client.close();
  server.close();
})();
