"use strict";

import {
  Server as ResponsiveWebSocketServer,
  WebSocketClient
} from "./../esExportInNodeJS.mjs";

import ResponsiveWebSocketClient from "./../Client.js";

(async function() {
  const server = new ResponsiveWebSocketServer(),
        port = 4443;
  await server.listen(port);

  ResponsiveWebSocketClient.setWebSocketClientClass(WebSocketClient);
  const client = new ResponsiveWebSocketClient();
  
  const connectionToClient = await new Promise(function(resolve, reject) {
    server.setConnectionListener(async function(connectionToClient) {
      console.log("connection url: ", connectionToClient.url);
      await connecting;
      resolve(connectionToClient);
    });
    const connecting = client.connect("ws://127.0.0.1:" + port + "/room/12345");
  });

  const {contentTypesOfMessages} = ResponsiveWebSocketClient;

  {
    const translateText = function(messageWithHeader, startIndex, responseSender) {
      const text = messageWithHeader.slice(startIndex);
      if (text === "send request and get data from server") {
        responseSender.sendTextResponse("отправить запрос и получить данные с сервера");
      }
    };
    connectionToClient.setTextRequestListener(translateText);

    const text = "send request and get data from server",
          responseStats = await client.sendTextRequest(text);
    const {
      contentType, message, startIndex
    } = responseStats;
    
    if (contentType === contentTypesOfMessages.text) {
      const translatedText = message.slice(startIndex);
      console.log("Response from translation service: ", translatedText);
    }
  }

  {
    const sendMagicNumber = function(messageWithHeader, startIndex, responseSender) {
      const response = new ArrayBuffer(1),
            dataView = new DataView(response);

      dataView.setUint8(0, 42);
      responseSender.sendBinaryResponse(response);
    };
    client.setAwaitingResponseTextMessageListener(sendMagicNumber);

    const question = "What is 'magic' number in some books about programming?",
          responseStats = await connectionToClient.sendAwaitingResponseTextMessage(question);
    const {
      contentType, message, startIndex
    } = responseStats;
    
    if (contentType === contentTypesOfMessages.binary) {
      const magicNumber = new DataView(message).getUint8(startIndex);
      console.log("The magic number is: ", magicNumber);
    }
  }

  {
    const sendCountOfProducts = function(bytes, startIndex, responseSender) {
      const idOfItem = new DataView(bytes).getUint16(startIndex),
            countOfProducts = idOfProductToCount.get(idOfItem);

      const response = new ArrayBuffer(2),
            dataView = new DataView(response);

      dataView.setUint16(0, countOfProducts);
      responseSender.sendBinaryResponse(response);
    };
    connectionToClient.setAwaitingResponseBinaryMessageListener(sendCountOfProducts);

    const idOfProductToCount = new Map([
      [1111, 2222], [333, 444]
    ]);

    await getCountOfProductsByIdAndLogResult(client, 1111);
    await getCountOfProductsByIdAndLogResult(client, 333);

    async function getCountOfProductsByIdAndLogResult(connection, idOfProduct) {
      const request = new ArrayBuffer(2),
            dataView = new DataView(request);

      dataView.setUint16(0, idOfProduct);

      const responseStats = await connection.sendAwaitingResponseBinaryMessage(request);
      const {message, startIndex} = responseStats;
      const count = new DataView(message).getUint16(startIndex);
      console.log("Count of products (id: ", idOfProduct, "): ", count);
    }
  }

  connectionToClient.close();
  client.close();
  server.close();
})();
