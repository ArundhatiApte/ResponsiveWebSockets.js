"use strict";

import isLittleEndian from "./../../common/ResponsiveWebSocketConnection/modules/messaging/binaryMessages/isLittleEndian";
import ResponsiveWebSocketClient from "./../../Client/ResponsiveWebSocketClient.js";

ResponsiveWebSocketClient.setWebSocketClientClass(window.WebSocket);

(async function() {
  const client = new ResponsiveWebSocketClient(),
        port = 4443,
        url = "ws://127.0.0.1:" + port + "/wsAPI/awjoiadwj";

  await client.connect(url);

  const sendInt32AndReceiveInt32 = async function(client, sendedInt32) {
    const sizeOfHeaderForBinaryRequest = client.sizeOfHeaderForBinaryRequest;
    const message = new ArrayBuffer(sizeOfHeaderForBinaryRequest + 4);
    new DataView(message).setInt32(sizeOfHeaderForBinaryRequest, sendedInt32, isLittleEndian);

    const binaryResponse = await client.sendBinaryRequest(message);
    return new DataView(binaryResponse).getInt32(client.startIndexOfBodyInBinaryResponse, isLittleEndian);
  };

  const int32Response = await sendInt32AndReceiveInt32(client, 123456);

  const expectEqual = function(a, b) {
    if (a !== b) {
      throw new Error("" + a + " !== " + b);
    }
  };

  expectEqual(int32Response, 123456 * 4);
  console.log("Ok");
})();
