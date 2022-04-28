# Responsive Web Sockets API

#### Table of contents

- [Class: ResponsiveWebSocketConnection](#class-responsivewebsocketconnection)
    * close([code, reason])
    * static contentTypesOfMessages
    * sendBinaryRequest(bytes[, maxTimeMsToWaitResponse])
    * sendTextRequest(text[, maxTimeMsToWaitResponse])
    * sendUnrequestingBinaryMessage(bytes)
    * sendUnrequestingTextMessage(text)
    * setBinaryRequestListener(listener)
    * setTextRequestListener(listener)
    * setCloseListener(listener)
    * setMalformedBinaryMessageListener(listener)
    * setMalformedTextMessageListener(listener)
    * setMaxTimeMsToWaitResponse(timeMs)
    * setUnrequestingBinaryMessageListener(listener)
    * setUnrequestingTextMessageListener(listener)
    * startIndexOfBodyInBinaryResponse
    * startIndexOfBodyInTextResponse
    * terminate()
    * static class TimeoutToReceiveResponseError
- [Class: ResponsiveWebSocketClient](#class-responsivewebsocketclient)
    * new ResponsiveWebSocketClient([options])
    * connect(url)
    * static setWebSocketClientClass(W3CWebSocketClient)
- [Class: ResponsiveWebSocketServer](#class-responsivewebSocketserver)
    * new ResponsiveWebSocketServer()
    * close()
    * listen(port)
    * setConnectionListener(listener)
    * setUpgradeListener(listener)
- [Class: ResponsiveWebSocketServerConnection](#class-responsivewebsocketserverconnection)
    * getRemoteAddress()
    * sendFragmentsOfBinaryRequest(...fragments)
    * sendFragmentsOfTextRequest(...fragments)
    * sendFragmentsOfUnrequestingBinaryMessage(...fragments)
    * sendFragmentsOfUnrequestingTextMessage(...fragments)
    * url
- [Class: ResponseSender](#class-responsesender)
    * sendBinaryResponse(response)
    * sendTextResponse(response)
- [Class: ServerResponseSender](#class-serverresponsesender)
    * sendFragmentsOfBinaryResponse(...fragments)
    * sendFragmentsOfTextResponse(...fragments)
- [Class: ResponseData](#class-responsedata)
- [Class: HandshakeAction](class-handshakeaction)
    * acceptConnection([userData])
    * cancelConnection()

## Class: ResponsiveWebSocketConnection

Base class for client and connection to client.
Provides methods for sending requests and messages without waiting response.

### close([code, reason])

* `code <number>`
* `reason <string>`

Initiate a closing handshake.

### static contentTypesOfMessages

* `<Object>`
    * `binary <number>` type of binary message
    * `text <number>` type of text message

### sendBinaryRequest(bytes[, maxTimeMsToWaitResponse])

* `bytes <ArrayBuffer>`  
Client connection accepts `<ArrayBuffer>` as bytes.
Server connection accepts `<string|ArrayBuffer|Uint8Array|Int8Array|Uint16Array|Int16Array|Uint32Array|Int32Array|Float32Array|Float64Array>` as bytes.
* `maxTimeMsToWaitResponse <number>`  
optional, by default value setted by `setMaxTimeMsToWaitResponse` method
* Returns `<Promise<ResponseData>>`

Sends awaiting response binary message. Receiver can give response by setting lisneter of "binaryRequest" event.
If response will not arrive within `maxTimeMsToWaitResponse` milliseconds, the `<Promise>` will be rejected with
`TimeoutToReceiveResponseError`.  
Example of usage: [sendingRequests.mjs](./examples/sendingRequests.mjs)

### sendTextRequest(text[, maxTimeMsToWaitResponse])

* `text <string>`  
Client connection accepts `<string>` as text.
Server connection accepts `<string|ArrayBuffer|Uint8Array|Int8Array|Uint16Array|Int16Array|Uint32Array|Int32Array|Float32Array|Float64Array>` as text.
* `maxTimeMsToWaitResponse <number>`  
optional, by default value setted by `setMaxTimeMsToWaitResponse` method
* Returns `<Promise<ResponseData>>`

Sends awaiting response text message. Receiver can give response by setting lisneter of 'textRequest' event.
If response will not arrive within `maxTimeMsToWaitResponse` milliseconds, the `<Promise>` will be rejected with
`TimeoutToReceiveResponseError`.  
Example of usage: [sendingRequests.mjs](./examples/sendingRequests.mjs)

### sendUnrequestingBinaryMessage(bytes)

* `bytes <ArrayBuffer>`  
Client connection accepts `<ArrayBuffer>` as bytes.
Server connection accepts `<string|ArrayBuffer|Uint8Array|Int8Array|Uint16Array|Int16Array|Uint32Array|Int32Array|Float32Array|Float64Array>` as bytes.

Sends binary message without waiting response.
When a message arrives to the recipient, the "unrequestingBinaryMessage" event is emitted.
 
### sendUnrequestingTextMessage(text)

* `text <string>`  
Client connection accepts `<string>` as text.
Server connection accepts `<string|ArrayBuffer|Uint8Array|Int8Array|Uint16Array|Int16Array|Uint32Array|Int32Array|Float32Array|Float64Array>` as text.

Sends text message without waiting response.
When a message arrives to the recipient, the "unrequestingTextMessage" event is emitted.

### setBinaryRequestListener(listener)

* `listener <function>`  
listener's signature: `(bytes, startIndex, responseSender)`
    * `bytes <ArrayBuffer>`
    a message containing the header and the body transmitted by the sender
    * `startIndex <number>`
    index of the first byte of the message body
    * `responseSender <ResponseSender>`
    object for sending binary or text response

Sets the listener of event, that occurs when a binary message is received,
the sender of which is waiting for a response.
`this` link inside the handler points to an instance of the `ResponsiveWebSocketConnection` class.
`listener` can be `null` or `undefined`.  
Example of usage: [sendingRequests.mjs](./examples/sendingRequests.mjs)

### setCloseListener(listener)

* `listener <function>`  
listener's signature: `(event)`
    * `event <Object>`
        * `code <number>`
        * `reason <string>`
        * `wasClean <bool>`

Sets the WebSocket connection close event handler.
`this` link inside the handler points to an instance of the `ResponsiveWebSocketConnection` class.
`listener` can be `null` or `undefined`.

### setMalformedBinaryMessageListener(listener)

* `listener <function>`  
listener's signature: `(message)`
    * `message <ArrayBuffer>`

Sets the listener of event, that occurs when a malformed binary message (message without valid header) is received.
`this` link inside the handler points to an instance of the `ResponsiveWebSocketConnection` class.
`listener` can be `null` or `undefined`.

Example:  
in node.js:
```js
serverConnection.setMalformedBinaryMessageListener(function() {
  this.terminate();
});
```
in browser:
```js
const webSocketClient = new WebSocket("wss://example.com");

webSocketClient.onopen = function() {
  webSocketClient.send(new Uint8Array([0, 1, 2, 3, 4]).buffer);
};
```

Notes:

* if the first byte of the message is 1 (as an unsigned integer) and the message is longer than two bytes,
then the message is treated as a request
* if the first byte of the message is 2 (as an unsigned integer) and the message is longer than two bytes,
then the message is treated as a response
* if the first byte of the message is 3 (as an unsigned integer),
then the message is treated as a unrequesting message

### setMalformedTextMessageListener(listener)

* `listener <function>`  
listener's signature: `(message)`
    * `message <string>`

Sets the listener of event, that occurs when a malformed text message (message without valid header) is received.
`this` link inside the handler points to an instance of the `ResponsiveWebSocketConnection` class.
`listener` can be `null` or `undefined`.

Example:  
in node.js:
```js
serverConnection.setMalformedBinaryMessageListener(function() {
  this.terminate();
});
```
in browser:
```js
const webSocketClient = new WebSocket("wss://example.com");

webSocketClient.onopen = function() {
  webSocketClient.send("zyxw");
};
```

### setMaxTimeMsToWaitResponse(timeMs)

* `timeMs <number>`

Default maximum time in milliseconds for waiting response on request.
This time can be redefined in second parametr in `sendBinaryRequest` or `sendTextRequest` methods.
By default 2000.

### setTextRequestListener(listener)

* `listener <function>`  
listener's signature: `(text, startIndex, responseSender)`
    * `text <string>`  
    a message containing the header and the body transmitted by the sender
    * `startIndex <number>`  
    the index of the first character in the `text` string, from which the message body begins
    * `responseSender <ResponseSender>`
    object for sending binary or text response

Sets the listener of event, that occurs when a text message is received,
the sender of which is waiting for a response.
`this` link inside the handler points to an instance of the `ResponsiveWebSocketConnection` class.
`listener` can be `null` or `undefined`.  
Example of usage: [sendingRequests.mjs](./examples/sendingRequests.mjs)

### setUnrequestingBinaryMessageListener(listener)

* `listener <function>`  
listener's signature: `(bytes, startIndex)`
    * `bytes <ArrayBuffer>`  
    a message containing the header and the body transmitted from the sender
    * `startIndex <number>`  
    index of the first byte of the message body

Sets the listener of event, that occurs when a binary message is received,
the sender of which is not waiting for a response.
`this` link inside the handler points to an instance of the `ResponsiveWebSocketConnection` class.
`listener` can be `null` or `undefined`.  
Example of usage: [sendingUnrequestingMessages.mjs](./examples/sendingUnrequestingMessages.mjs)

### setUnrequestingTextMessageListener(listener)

* `listener <function>`  
listener's signature: `(text, startIndex)`
    * `text <string>`  
    a message containing the header and the body transmitted from the sender
    * `startIndex <number>`  
    the index of the first character in the `text` string, from which the message body begins

Sets the listener of event, that occurs when a text message is received,
the sender of which is not waiting for a response.
`this` link inside the handler points to an instance of the `ResponsiveWebSocketConnection` class.
`listener` can be `null` or `undefined`.  
Example of usage: [sendingUnrequestingMessages.mjs](./examples/sendingUnrequestingMessages.mjs)

### startIndexOfBodyInBinaryResponse

* `<number>`

Index of the first byte, from which the message body begins.

### startIndexOfBodyInTextResponse

* `<number>`

Index of the first character, from which the message body begins.

### terminate()

Forcibly close the connection. ResponsiveWebSocketClient in browser does not implement this method.

### Static class TimeoutToReceiveResponseError

Error, that throwed when the response to the request
did not arrive during the max time for waiting response on request.

## Class ResponsiveWebSocketClient

* extends `ResponsiveWebSocketConnection`

### new ResponsiveWebSocketClient([options])

* `options <Object>` only for ResponsiveWebSocketClient in node.js
    * `followRedirects <boolean>`
    whether or not to follow redirects. Defaults to `false`.
    * `generateMask <function>`
    the function used to generate the masking key.
    It takes a `<Buffer>` that must be filled synchronously and is called before a message is sent,
    for each message. By default the buffer is filled with cryptographically strong random bytes.
    * `handshakeTimeout <number>`
    timeout in milliseconds for the handshake request.
    This is reset after every redirection.
    * `maxPayload <number>`
    the maximum allowed message size in bytes. Defaults to 100 MiB (104857600 bytes).
    * `maxRedirects <number>`
    the maximum number of redirects allowed. Defaults to 10.
    * `origin <string>`
    value of the `Origin` or `Sec-WebSocket-Origin` header depending on the `protocolVersion`.
    * `protocolVersion <number>`
    value of the `Sec-WebSocket-Version` header.
    * `skipUTF8Validation <boolean>`
    specifies whether or not to skip UTF-8 validation for text and close messages.
    Defaults to `false`.

Creates new ResponsiveWebSocketClient.

### connect(url)

* `url <string>` adress of the server
* Returns `<Promise>`

Connects to the WebSocket server.

### static setWebSocketClientClass(W3CWebSocketClient)

* `W3CWebSocketClient <function>`  
class, implementing WebSocketClient interface by W3C

Sets the WebSocket class, on the base of which objects of the ResponsiveWebSocketClient class will be created.
The method must be called before the first call of the new ResponsiveWebSocketClient() constructor.

Method provides opportunity to use ResponsiveWebSocketClient in browser and node.js.  
Example:  
in node.js:
```js
import ResponsiveWebSocketServer from "ResponsiveWebSockets/Server";
import W3CWebSocketClient from "ResponsiveWebSockets/W3CWebSocketClient";
import ResponsiveWebSocketClient from "ResponsiveWebSockets/Client";

ResponsiveWebSocketClient.setWebSocketClientClass(W3CWebSocketClient);
```

in browser:
```js
import ResponsiveWebSocketClient from "ResponsiveWebSockets/Client";

ResponsiveWebSocketClient.setWebSocketClientClass(window.WebSocket);
```  

## Class ResponsiveWebSocketServer

### new ResponsiveWebSocketServer([options])

* `options <Object>` [uWebSockets.js doc](https://unetworking.github.io/uWebSockets.js/generated/interfaces/WebSocketBehavior.html)  
    * `compression <number>`
    * `idleTimeout <number>`
    * `maxBackpressure <number>`
    * `maxPayloadLength <number>`
    * `sendPingsAutomatically `
    * `server` `<App>` or `<SSLApp>` from uWebSockets.js  
By default, the new http server will be created.
    * `url <string>`
Addres of the WebSocket server. Examples: "/wsAPI/*", "/room/*".
By default: "/*".

Creates new ResponsiveWebSocketServer.

### close()

Closes http or https server, to which the WebSocket server is attached.

### listen(port)

* `port <number>`
* Returns `<Promise>`

Starts port listening.

### setConnectionListener(httpRequest, listener)

* `listener <function>`  
listener's signature: `(connection)`
    * `connection <ResponsiveWebSocketServerConnection>` connection to the client

The "connection" event occurs when the WebSocket client connects to the server.
`this` link inside the handler points to an instance of the `ResponsiveWebSocketServer` class.
`listener` can be `null` or `undefined`.

### setUpgradeListener(listener)

* `listener <function>`
listener's signature: `(httpRequest, handshakeAction)`
    * `httpRequest <HttpRequest>` request from uWebSockets.js
    * `handshakeAction <HandshakeAction>`
    an object that can accept or reject a request for creating a WebSocket connection

The method sets the event handler that occurs when server receive request to create a WebSocket connection.
By default, all connections are accepted.
`this` link inside the handler points to the instance object `ResponsiveWebSocketServer'.
`listener` can be `null` or `undefined`.

## Class ResponsiveWebSocketServerConnection

* extends `ResponsiveWebSocketConnection`

Connection to the client.

### getRemoteAddress()

* Returns `<ArrayBuffer>`

Returns the remote binary IP address.
IPv4 is 4 byte long and can be converted to text by printing every byte as a digit between 0 and 255.
IPv6 is 16 byte long and can be converted to text by printing every byte as a digit between 0 and 255 in HEX.

### sendFragmentsOfBinaryRequest(...fragments)

* `...fragments <string|ArrayBuffer|Uint8Array|Int8Array|Uint16Array|Int16Array|Uint32Array|Int32Array|Float32Array|Float64Array>` parts of request
* Returns `<Promise<ResponseData>>`

Sends a binary request, similar as `sendBinaryRequest'.
The method sends data in fragments, without connecting parts into one body,
avoiding memory allocation for the entire request.  
Example of usage:
```js
const smallHeader = new Uint8Array([1, 2, 3, 4]).buffer;
const bigBody = new Uint8Array([10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 1, 2, 3, 4, 5, 6, 7, 8, 9]).buffer;
const responseData = await connection.sendFragmentsOfBinaryRequest(smallHeader, bigBody);
```

### sendFragmentsOfTextRequest(...fragments)

* `...fragments <string|ArrayBuffer|Uint8Array|Int8Array|Uint16Array|Int16Array|Uint32Array|Int32Array|Float32Array|Float64Array>` parts of request
* Returns `<Promise<ResponseData>>`

Sends a text request, similar as `sendTextRequest'.
The method sends data in fragments, without connecting parts into one body,
avoiding memory allocation for the entire request.  
Example of usage:
```js
const smallHeader = "abcd";
const bigBody = "Lorem Ipsum. ".repeat(20);
const responseData = await connection.sendFragmentsOfTextRequest(smallHeader, bigBody);
```

### sendFragmentsOfUnrequestingBinaryMessage(...fragments)

* `...fragments <string|ArrayBuffer|Uint8Array|Int8Array|Uint16Array|Int16Array|Uint32Array|Int32Array|Float32Array|Float64Array>` parts of message

Sends binary unrequesting message, similar as `sendUnrequestingBinaryMessage`.
The method sends data in fragments, without connecting parts into one body,
avoiding memory allocation for the entire message.

### sendFragmentsOfUnrequestingTextMessage(...fragments)

* `...fragments <string|ArrayBuffer|Uint8Array|Int8Array|Uint16Array|Int16Array|Uint32Array|Int32Array|Float32Array|Float64Array>` parts of message

Sends text unrequesting message, similar as `sendUnrequestingTextMessage`.
The method sends data in fragments, without connecting parts into one body,
avoiding memory allocation for the entire message.

### url

* `<string>`

Address, to which WebSocket client connected.

### userData

* `<any>`

Optional field, for information attached to the client connection object
when calling the `acceptConnection(userData)` method of the 'HandshakeAction` instance.

## Class ResponseSender

An object passed to the handlers of 'binaryRequest' and 'textRequest' event.
You can send a binary or text response to a binary request.
You can send a text or binary response to a text request.
The method for sending the response (sendBinaryResponse or sendTextResponse) is called only 1 time.

### sendBinaryResponse(bytes)

* `bytes <string>` the response.
Client connection accepts `<ArrayBuffer>` as bytes.
Server connection accepts `<string|ArrayBuffer|Uint8Array|Int8Array|Uint16Array|Int16Array|Uint32Array|Int32Array|Float32Array|Float64Array>` as bytes.

### sendTextResponse(text)

* `text <string>` the response.
Client connection accepts `<string>` as response.
Server connection accepts `<string|ArrayBuffer|Uint8Array|Int8Array|Uint16Array|Int16Array|Uint32Array|Int32Array|Float32Array|Float64Array>` as response.

## Class ServerResponseSender

* extends `ResponseSender`

### sendFragmentsOfBinaryResponse(...fragments)

* `...fragments <string|ArrayBuffer|Uint8Array|Int8Array|Uint16Array|Int16Array|Uint32Array|Int32Array|Float32Array|Float64Array>` parts of response

Sends binary response, similar as `sendBinaryResponse`.
The method sends data in fragments, without connecting the parts into one body,
avoiding allocating memory for the entire response.

### sendFragmentsOfTextyResponse(...fragments)

* `...fragments <string|ArrayBuffer|Uint8Array|Int8Array|Uint16Array|Int16Array|Uint32Array|Int32Array|Float32Array|Float64Array>` parts of response

Sends text response, similar as `sendTextResponse`.
The method sends data in fragments, without connecting the parts into one body,
avoiding allocating memory for the entire response.

## Class ResponseData

Data about response.

### contentType

* `<number>`

Content type of the response. Value of `contentTypesOfMessages` enumeration,
`contentTypesOfMessages.binary` or `contentTypesOfMessages.text`.
    
### message

* `<ArrayBuffer>` or `<string>`

The response received over the web socket containing the service header and body.

## Class HandshakeAction

Class that accepts or rejects requests to create a WebSocket connection.

### acceptConnection([userData])

* `userData <any>`
data attached to the client connection object. Optional parameter.

Accepts a request to create a WebSocket connection.

### cancelConnection()

Rejects the request to create a WebSocket connection.
