## ResposiveWebSockets

Sending requests and messages web sockets.

### Overview

Standard web socket has method for sending messages and event of incoming message.
Sometimes thing to do simething like this may come:
```js
const connection = new WebSocket("wss://example.com/translator");
// ...
const response = await connection.send("translate this to indian");
```

ResposiveWebSockets module provides opportunity to send requests and get response via web sockets, and opportunity to send
messages without waiting response:
```js
const responseData = await connection.sendTextRequest("some request");
const {message, contentType} = responseData;
const startIndex = connection.startIndexOfBodyInTextResponse;
console.log("response body: ", message.slice(startIndex));
```

### Installation

`npm install github:ArundhatiApte/ResponsiveWebSockets-JS`  
or  
`yarn add github:ArundhatiApte/ResponsiveWebSockets-JS`

### Usage

#### Example in node.js

```js
"use strict";

import ResponsiveWebSocketServer from "ResponsiveWebSockets/Server";
import W3CWebSocketClient from "ResponsiveWebSockets/W3CWebSocketClient";
import ResponsiveWebSocketClient from "ResponsiveWebSockets/Client";

// const ResponsiveWebSocketServer = require("ResponsiveWebSockets/Server");
// const W3CWebSocketClient = requre("ResponsiveWebSockets/W3CWebSocketClient"); // commonJS
// const ResponsiveWebSocketClient = require("ResponsiveWebSockets/Client");

(async () => {
  const server = new ResponsiveWebSocketServer(),
        port = 8443;
  await server.listen(port);

  ResponsiveWebSocketClient.setWebSocketClientClass(W3CWebSocketClient);
  const client = new ResponsiveWebSocketClient();
  
  const connectionToClient = await new Promise((resolve, reject) => {
    server.setConnectionListener(async (connectionToClient) => {
      console.log("cleint connected, url: ", connectionToClient.url);
      await connectingClient;
      resolve(connectionToClient);
    });
    const connectingClient = client.connect("ws://127.0.0.1:" + port + "/room/12345");
  });

  connectionToClient.setTextRequestListener((message, startIndex, responseSender) => {
    const body = message.slice(startIndex);

    if (body === "get some text") {
      responseSender.sendTextResponse("Lorem Ipsum");
      return;
    }
    if (body === "What is the answer on everything?") {
      const response = new ArrayBuffer(1),
            dataView = new DataView(response);
      dataView.setUint8(0, 42);
      responseSender.sendBinaryResponse(response);
    }
  });

  {
    const {
      message,
      contentType
    } = await client.sendTextRequest("get some text");
    const startIndex = client.startIndexOfBodyInTextResponse;
    console.log("get some text -> ", message.slice(startIndex));
  }

  {
     const {
      message,
      contentType
    } = await client.sendTextRequest("What is the answer on everything?");
    const startIndex = client.startIndexOfBodyInBinaryResponse;
    const number = new DataView(message).getUint8(startIndex);
    console.log("The answer on everything is ", number);
  }

  client.setUnrequestingTextMessageListener((message, startIndex) => {
    console.log(message.slice(startIndex));
  });

  connectionToClient.sendUnrequestingTextMessage("some event");
})();
```

#### Usage in browser

```js
"use strict";

import ResponsiveWebSocketClient from "ResponsiveWebSockets/Client";
ResponsiveWebSocketClient.setWebSocketClientClass(window.WebSocket);
// succesfuly compiled by webpack
// ...
```

After call `setWebSocketClientClass(window.WebSocket)`, class `ResponsiveWebSocketClient` is ready for usage.
Because the code of `ResponsiveWebSocketClient` does not depend on node.js modules, webpack compiles the class code.

### Links:

- [API documentation](./docs/API.md)
- [examples of usage](./examples)

### Launching tests

- download repository from github
- install all dependencies: `yarn install --production=false`
- launch tests: `yarn run tests`

### License

[Apache-2.0](http://www.apache.org/licenses/LICENSE-2.0)

### Support:

- Bitcoin Cash: qq0j7w2nvjvtk6r5pxux8d3ekse6kqz44qxxr7ayw6
- Ethereum: 0x6987e6De173C0f055B7039B314f2cedbFDA33582
- Litecoin: ltc1qtc8mh6lhv038tsm9z5y9jfxdtk5rlr6ueuc78u
- Polkadot: 1RMn2ThRFfz2kdkR3eqoAmaQFHT9yQVHYrhPdcKVNpzz9bU
