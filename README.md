## ResposiveWebSockets

Sending requests and unrequesting messages wrapper for web sockets.
Client works in a browser and node.js. Module use lightweight message format.
Size of request header and response header is 3 byte, unrequesting message header is 1 byte.

### Overview

Standard web socket has method for sending messages and event of incoming message.
Sometimes thing to do simething like this may come:

```js
const connection = new WebSocket("wss://example.com/translator");
// ...
const response = await connection.sendRequest(message);
```

ResposiveWebSockets module provides opportunity to send requests and get response via web sockets,
and opportunity to send messages without waiting response:

```js
const response = await connection.sendBinaryRequest(new Uint8Array([1, 2, 3, 4]).buffer);
const startIndex = connection.startIndexOfBodyInBinaryResponse;
console.log("response: ", new Uint8Array(response, startIndex));
```

### Installation

Download repo. In root folder of project execute script createPackage.sh.
In folder of your project install module by package manager:
`npm install path/to/ResponsiveWebSockets.package.tar.gz`.

### Usage

Using methods to send requests, responses and unrequesting messages has a difference
between a client and a server connection.  
Example of using a server connection:

```js
let message = new Uint8Array([11, 22, 33, 44]);
const binaryResponse = await serverConnection.sendBinaryRequest(message);
console.log("binary response: ", new Uint8Array(
  binaryResponse,
  serverConnection.startIndexOfBodyInBinaryResponse
));

message = new Uint8Array([55, 66]);
serverConnection.sendUnrequestingBinaryMessage(message);

serverConnection.setBinaryRequestListener(function echo(messageWithHeader, startIndex, responseSender) {
  responseSender.sendBinaryResponse(new Uint8Array(messageWithHeader, startIndex));
});
```

The server connection accepts typed arrays or `ArrayBuffer` as a parameter,
the client connection accepts only `ArrayBuffer`. Since the WebSocket in the browser does not have a way to send
a message in parts, in different frames, for performance purposes, the client connection, when sending
a request, response or an unrequesting message, expects to receive an `ArrayBuffer` with an empty space
at the beginning for the header. (Avoiding allocating a new block of memory for the header + message body)  
Example of using a client connection:

```js
{
  const sizeOfHeader = client.sizeOfHeaderForBinaryRequest;
  const sizeOfBody = 4;
  const message = new ArrayBuffer(sizeOfHeader + sizeOfBody);
  // fill the message from index = sizeOfHeader
  const binaryResponse = await client.sendBinaryRequest(message);
  console.log("binary response: ", new Uint8Array(
    binaryResponse,
    client.startIndexOfBodyInBinaryResponse
  ));
}
{
  const sizeOfHeader = client.sizeOfHeaderForUnrequestingBinaryMessage;
  const sizeOfBody = 2;
  const message = new ArrayBuffer(sizeOfHeader + sizeOfBody);
  // fill the message from index = sizeOfHeader
  client.sendUnrequestingBinaryMessage(message);
}

client.setBinaryRequestListener((messageWithHeader, startIndex, responseSender) => {
  const sizeOfHeader = client.sizeOfHeaderForBinaryResponse;
  const sizeOfBody = 4;
  const message = new ArrayBuffer(sizeOfHeader + sizeOfBody);
  // fill the message from index = sizeOfHeader
  responseSender.sendBinaryResponse(message);
});
```

Examples:
[sendingBinaryRequests.mjs](./examples/sendingBinaryRequests.mjs),
[sendingUnrequestingBinaryMessages.mjs](./examples/sendingUnrequestingBinaryMessages.mjs)

#### Text messages

Responsive WebSockets don't have methods for sending text requests, unrequesting messages or responses,
thar accepts a string as parametr, for performance reasons
(strings are immutable, unlike `ArrayBuffer`, the client will have to allocate a block of memory for the message).
To send text,
[TextEncoder](https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder)
and
[TextDecoder](https://developer.mozilla.org/en-US/docs/Web/API/TextDecoder),
will help, allowing you to fill the `ArrayBuffer` with bytes of a string in UTF-8.  
Example of sending text in request by client:

```js
const textEncoder = new TextEncoder("utf-8");
const textDecoder = new TextDecoder("utf-8");

const stringMessage = "hello";
const byteSizeOfStringMesageInUTF8 = 5;
const sizeOfHeader = client.sizeOfHeaderForBinaryRequest;
const message = new ArrayBuffer(sizeOfHeader + byteSizeOfStringMesageInUTF8);

const startIndex = sizeOfHeader;
textEncoder.encodeInto(stringMessage, new Uint8Array(message, startIndex));

const binaryResponse = await client.sendBinaryRequest(message);
console.log("text in response: ", textDecoder.decode(new Uint8Array(
  binaryResponse,
  client.startIndexOfBodyInBinaryResponse
)));
```


Example of sending text in request by server connection:

```js
const textEncoder = new TextEncoder("utf-8");
const textDecoder = new TextDecoder("utf-8");

const message = textEncoder.encode("hello");

const binaryResponse = await serverConnection.sendBinaryRequest(message);
console.log("text in response: ", textDecoder.decode(new Uint8Array(
  binaryResponse,
  serverConnection.startIndexOfBodyInBinaryResponse
)));
```

Example: [sendingTextInBinaryRequests.mjs](./examples/sendingTextInBinaryRequests.mjs)

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

### Compatible implementation in another language

[Description of messages headers format](./docs/messagesHeadersFormat.md)

### Links:

- [API documentation](./docs/API.md)
- [examples of usage](./examples)

### Launching tests

- download project source code from releases page
- install all dependencies: `npm install --production=false`
- launch tests: `npm test`

### License

[Apache-2.0](http://www.apache.org/licenses/LICENSE-2.0)

### Support:

- Bitcoin Cash: qq0j7w2nvjvtk6r5pxux8d3ekse6kqz44qxxr7ayw6
- Ethereum: 0x6987e6De173C0f055B7039B314f2cedbFDA33582
- Litecoin: ltc1qtc8mh6lhv038tsm9z5y9jfxdtk5rlr6ueuc78u
- Polkadot: 1RMn2ThRFfz2kdkR3eqoAmaQFHT9yQVHYrhPdcKVNpzz9bU
