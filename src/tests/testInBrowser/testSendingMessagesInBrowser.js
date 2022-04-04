"use strict";

import ResponsiveWebSocketClient from "./../../Client/ResponsiveWebSocketClient.js";

ResponsiveWebSocketClient.setWebSocketClientClass(window.WebSocket);

(async function() {
  const client = new ResponsiveWebSocketClient(),
        port = 4443,
        url = "ws://127.0.0.1:" + port + "/wsAPI/awjoiadwj";

  await client.connect(url);

  const sendTextAndReceiveResponse = async function(client, sendedText) {
    const startIndex = client.startIndexOfBodyInTextResponse;
    const {message} = await client.sendTextRequest(sendedText);
    return message.slice(startIndex);
  };

  const sendInt32AndReceiveInt32 = async function(client, sendedInt32) {
    const message = new ArrayBuffer(4);
    let dataView = new DataView(message);
    dataView.setInt32(0, sendedInt32);

    const {message: response} = await client.sendBinaryRequest(message);
    dataView = new DataView(response);
    const startIndex = client.startIndexOfBodyInBinaryResponse;
    return dataView.getInt32(startIndex);
  };

  const [textResponse, int32Response] = await Promise.all([
    sendTextAndReceiveResponse(client, "Lorem Ipsum"),
    sendInt32AndReceiveInt32(client, 123456)
  ]);

  const expectEqual = function(a, b) {
    if (a !== b) {
      throw new Error("" + a + " !== " + b);
    }
  };

  expectEqual(textResponse, "Lorem Ipsum".toUpperCase());
  expectEqual(int32Response, 123456 * 4);

  console.log("Ok");
})();
