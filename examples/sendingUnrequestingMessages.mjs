"use strict";

import packageForNodeJS from "./../exportInNodeJS.js";
const {Server: ResponsiveWebSocketServer, W3CWebSocketClient} = packageForNodeJS;

import ResponsiveWebSocketClient from "./../src/ResponsiveWebSocketClient/ResponsiveWebSocketClient.js";

(async function() {
  const server = new ResponsiveWebSocketServer(),
        port = 4443;
  await server.listen(port);

  ResponsiveWebSocketClient.setWebSocketClientClass(W3CWebSocketClient);
  const client = new ResponsiveWebSocketClient();
  
  const connectionToClient = await new Promise(function(resolve, reject) {
    server.setConnectionListener(async function(connectionToClient) {
      console.log("connection url: ", connectionToClient.url);
      await connecting;
      resolve(connectionToClient);
    });
    const connecting = client.connect("ws://127.0.0.1:" + port + "/room/1234");
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
    sendClientAction(client, action.addingItem, 1100);
    sendClientAction(client, action.removingItem, idOfItem);

    function sendClientAction(connection, idOfAction, idOfItem) {
      const message = new ArrayBuffer(3),
            dataView = new DataView(message);

      dataView.setUint8(0, idOfAction);
      dataView.setUint16(1, idOfItem);
      connection.sendUnrequestingBinaryMessage(message);
    }
  }

  await new Promise(function wait(resolve) {
    return setTimeout(resolve, 200);
  });
  connectionToClient.close();
  client.close();
  server.close();
})();
