# Responsive WebSockets API

#### Table of Contents

- [Class: ResponsiveWebSocketConnection](#class-responsivewebsocketconnection)
    * close([code[, reason]])
    * setCloseListener(listener)
    * setErrorListener(listener)
    * setMalformedBinaryMessageListener(listener)
    * setMaxTimeMsToWaitResponse(timeMs)
    * setUnrequestingBinaryMessageListener(listener)
    * startIndexOfBodyInBinaryResponse
    * terminate()
    * static class TimeoutToReceiveResponseError
    * url
- [Class: ResponsiveWebSocketClient](#class-responsivewebsocketclient)
    * new ResponsiveWebSocketClient([protocols[, options]])
    * connect(url)
    * sendBinaryRequest(message[, maxTimeMsToWaitResponse])
    * sendUnrequestingBinaryMessage(message)
    * setBinaryRequestListener(listener)
    * setTextMessageListener(listener)
    * static setWebSocketClientClass(W3CWebSocketClient)
    * sizeOfHeaderForBinaryRequest
    * sizeOfHeaderForBinaryResponse
    * sizeOfHeaderForUnrequestingBinaryMessage
- [Class: ClientResponseSender](#class-clientresponsesender)
    * sendBinaryResponse(message)
- [Class: ResponsiveWebSocketServer](#class-responsivewebsocketserver)
    * new ResponsiveWebSocketServer(options)
    * close()
    * listen(port)
    * setConnectionListener(listener)
    * setUpgradeListener(listener)
    * static setUWebSockets(uWebSocketsImpl)
- [Class: HandshakeAction](class-handshakeaction)
    * acceptConnection([userData])
    * rejectConnection()
- [Class: ResponsiveWebSocketServerConnection](#class-responsivewebsocketserverconnection)
    * getRemoteAddress()
    * sendBinaryRequest(message[, maxTimeMsToWaitResponse])
    * sendFragmentsOfBinaryRequest(...fragments)
    * sendFragmentsOfUnrequestingBinaryMessage(...fragments)
    * sendUnrequestingBinaryMessage(message)
    * setBinaryRequestListener(listener)
    * setTextMessageListener(listener)
    * url
    * userData
- [Class: ServerConnectionResponseSender](#class-serverresponsesender)
    * sendBinaryResponse(message)
    * sendFragmentsOfBinaryResponse(...fragments)

## Class: ResponsiveWebSocketConnection

Base class for server connection and client.

### close([code[, reason]])

* `code <number>`
* `reason <string>`

Initiate a closing handshake.

### setCloseListener(listener)

* `listener <function>`  
listener's signature: `(event)`
    * `event <Object>`
        * `code <number>`
        * `reason <string>`
        * `wasClean <bool>`

Sets the WebSocket connection close event listener.
`this` link inside the handler points to an instance of the `ResponsiveWebSocketConnection` class.
`listener` can be `null`.

### setErrorListener(listener)

* `listener <function>`  
listener's signature: `(error)`
    * `error <Error>`

Sets listener of error from inner WebSocket connection.

### setMalformedBinaryMessageListener(listener)

* `listener <function>`  
listener's signature: `(message)`
    * `message <ArrayBuffer>`

Sets the listener of event, that occurs when a malformed binary message (message without valid header) is received.
`this` link inside the handler points to an instance of the `ResponsiveWebSocketConnection` class.
`listener` can be `null`.

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

### setMaxTimeMsToWaitResponse(timeMs)

* `timeMs <number>`

Sets default maximum time in milliseconds for waiting response on request.
This time can be redefined in second parametr in `sendBinaryRequest` method.
By default 2000.

### setUnrequestingBinaryMessageListener(listener)

* `listener <function>`  
listener's signature: `(bytes, startIndex)`
    * `bytes <ArrayBuffer>` Message containing the header and the body transmitted from the sender
    * `startIndex <number>` Index of the first byte of the message body

Sets the listener of event, that occurs when a binary message is received,
the sender of which is not waiting for a response.
`this` link inside the handler points to an instance of the `ResponsiveWebSocketConnection` class.  
Example of usage: [sendingUnrequestingBinaryMessages.mjs](/examples/sendingUnrequestingBinaryMessages.mjs)

### startIndexOfBodyInBinaryResponse

* `<number>`

Index of the first byte in binary response, from which the message body begins.

### terminate()

Forcibly close the connection. `ResponsiveWebSocketClient` in browser does not implement this method.

### Static class TimeoutToReceiveResponseError

Error, that throwed when the response to the request
did not arrive during the max time for waiting response on request.

### url

* `<string>`

WebSocket connection address.

## Class ResponsiveWebSocketClient

* extends `ResponsiveWebSocketConnection`

### new ResponsiveWebSocketClient([protocols[, options]])

* `protocols <string[]>` List of subprotocols
* `options <Object>` Only for ResponsiveWebSocketClient in node.js
    * `followRedirects <boolean>`
    Whether or not to follow redirects. Defaults to `false`.
    * `generateMask <function>`
    The function used to generate the masking key.
    It takes a `<Buffer>` that must be filled synchronously and is called before a message is sent,
    for each message. By default the buffer is filled with cryptographically strong random bytes.
    * `handshakeTimeout <number>`
    Timeout in milliseconds for the handshake request.
    This is reset after every redirection.
    * `maxPayload <number>`
    The maximum allowed message size in bytes. Defaults to 100 MiB (104857600 bytes).
    * `maxRedirects <number>`
    The maximum number of redirects allowed. Defaults to 10.
    * `origin <string>`
    Value of the `Origin` or `Sec-WebSocket-Origin` header depending on the `protocolVersion`.
    * `protocolVersion <number>`
    Value of the `Sec-WebSocket-Version` header.
    * `skipUTF8Validation <boolean>`
    Specifies whether or not to skip UTF-8 validation for text and close messages.
    Defaults to `false`.

Creates new ResponsiveWebSocketClient.

### connect(url)

* `url <string>` Adress of the server
* Returns `<Promise>`

Connects to the WebSocket server.

### sendBinaryRequest(message[, maxTimeMsToWaitResponse])

* `message <ArrayBuffer>`
Request message containing a free bytes for the header at the beginning.
The size of header is equal to the value of the `sizeOfHeaderForBinaryRequest` property.
* `maxTimeMsToWaitResponse <number>`  
Optional, by default value setted by `setMaxTimeMsToWaitResponse` method
* Returns `<Promise<ArrayBuffer>>`

Sends awaiting response binary message.
Receiver can give response by setting listener whith `setBinaryRequestListener` method.
If response will not arrive within `maxTimeMsToWaitResponse` milliseconds, the `<Promise>` will be rejected with
`TimeoutToReceiveResponseError`.  
Example of usage: [sendingBinaryRequests.mjs](/examples/sendingBinaryRequests.mjs)

### sendUnrequestingBinaryMessage(message)

* `message <ArrayBuffer>`
Message containing a free bytes for the header at the beginning.
The size of header is equal to the value of the `sizeOfHeaderForUnrequestingBinaryMessage` property.

Sends binary message without waiting response.
Receiver can handle data by setting listener whith `setUnrequestingBinaryMessageListener` method.  
Example of usage: [sendingUnrequestingBinaryMessages.mjs](/examples/sendingUnrequestingBinaryMessages.mjs).

### setBinaryRequestListener(listener)

* `listener <function>`  
listener's signature: `(bytes, startIndex, responseSender)`
    * `bytes <ArrayBuffer>` Message containing the header and the body transmitted by the sender
    * `startIndex <number>` Index of the first byte of the message body
    * `responseSender <ClientResponseSender>` Object for sending response

Sets the listener of event, that occurs when a binary message is received,
the sender of which is waiting for a response.
`this` link inside the handler points to an instance of the `ResponsiveWebSocketClient` class.  
Example of usage: [sendingBinaryRequests.mjs](/examples/sendingBinaryRequests.mjs)

### setTextMessageListener(listener)

* `listener <function>`  
listener's signature: `(message)`
    * `message <string>` Text message received by WebSocket

Sets the listener of event, that occurs when a text message is received.
`this` link inside the handler points to an instance of the `ResponsiveWebSocketClient` class.
`listener` can be `null`.

### static setWebSocketClientClass(W3CWebSocketClient)

* `W3CWebSocketClient <function>` Class, implementing
[WebSocketClient](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket) interface by W3C

Sets the WebSocket class, on the base of which objects of the `ResponsiveWebSocketClient` class will be created.
The method must be applied before the first call of the `ResponsiveWebSocketClient` constructor.

Method provides opportunity to use `ResponsiveWebSocketClient` in browser and node.js.  
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

### sizeOfHeaderForBinaryRequest

* `<number>`

### sizeOfHeaderForBinaryResponse

* `<number>`

### sizeOfHeaderForUnrequestingBinaryMessage

* `<number>`

## Class ClientResponseSender

Client-side class that sends a response to a request.
The method for sending the response is called only 1 time.

### sendBinaryResponse(message)

* `message <ArrayBuffer>` Message containing a free space for the header at the beginning.
The size of header is equal to the value of the `sizeOfHeaderForBinaryResponse` property
of the `ResponsiveWebSocketClient` class object.

Sends binary response. Example of usage: [sendingBinaryRequests.mjs](/examples/sendingBinaryRequests.mjs).

## Class ResponsiveWebSocketServer

### new ResponsiveWebSocketServer(options)

* `options <Object>` [uWebSockets.js doc](https://unetworking.github.io/uWebSockets.js/generated/interfaces/WebSocketBehavior.html)  
    * `compression <number>`
    * `idleTimeout <number>`
    * `maxBackpressure <number>`
    * `maxPayloadLength <number>`
    * `sendPingsAutomatically `
    * `server` `<App|SSLApp>` from [uWebSockets.js]
    * `url <string>` Addres of the WebSocket server. Example: "/room/*". By default: "/*".

Creates new ResponsiveWebSocketServer.

### close()

Closes http or https server, to which the WebSocket server is attached.

### listen(port)

* `port <number>`
* Returns `<Promise>`

Starts port listening.

### setConnectionListener(listener)

* `listener <function>`  
listener's signature: `(connection)`
    * `connection <ResponsiveWebSocketServerConnection>` server connection to the client

The connection event occurs when the WebSocket client connects to the server.
`this` link inside the handler points to an instance of the `ResponsiveWebSocketServer` class.
`listener` can be `null`.

### setUpgradeListener(listener)

* `listener <function>`  
listener's signature: `(httpRequest, handshakeAction)`
    * `httpRequest <HttpRequest>` Request from uWebSockets.js
    * `handshakeAction <HandshakeAction>`
    Object that can accept or reject a request for creating a WebSocket connection

Sets the listener of event that occurs when server receive request to create a WebSocket connection.
By default, all connections are accepted.
`this` link inside the handler points to the instance object `ResponsiveWebSocketServer'.
`listener` can be `null`.

### static setUWebSockets(uWebSocketsImpl)

* `uWebSocketsImpl <Object>` Link to the used implementation of [uWebSockets.js] with version 20.x.x

Sets version of [uWebSockets.js], on basis of which ResponsiveWebSocketServer runs.
The function must be applied before the first call of the `ResponsiveWebSocketServer.close` method.
Procedure provides opportunity to break a hard dependency from a specific version of [uWebSockets.js].  
Example:

```js
import uWebSockets from "uWebSockets.js";

import ResponsiveWebSocketServer from "ResponsiveWebSockets/Server";

ResponsiveWebSocketServer.setUWebSockets(uWebSockets);
```

## Class HandshakeAction

Class that accepts or rejects requests to create a WebSocket connection.

### acceptConnection([userData])

* `userData <any>`
Data attached to the server connection object. Optional parameter.

Accepts a request to create a WebSocket connection.

### rejectConnection()

Rejects the request to create a WebSocket connection.

## Class ResponsiveWebSocketServerConnection

* extends `ResponsiveWebSocketConnection`

Server connection to the client.

### getRemoteAddress()

* Returns `<ArrayBuffer>`

Returns the remote binary IP address.
IPv4 is 4 byte long and can be converted to text by printing every byte as a digit between 0 and 255.
IPv6 is 16 byte long and can be converted to text by printing every byte as a digit between 0 and 255 in HEX.

### sendBinaryRequest(message[, maxTimeMsToWaitResponse])

* `message <ArrayBuffer|Uint8Array|Int8Array|Uint16Array|Int16Array|Uint32Array|Int32Array|Float32Array|Float64Array>`
Message of request
* `maxTimeMsToWaitResponse <number>`
Optional, by default value setted by setMaxTimeMsToWaitResponse method
* Returns `<Promise<ArrayBuffer>>`

Sends awaiting response binary message.
The method expects to receive the message body without free space for the header, unlike
`sendBinaryRequest` of the `ResponsiveWebSocketClient` class.
The recepient has the ability to send a response by setting the event handler
with the `setBinaryRequestListener` method.
If response will not arrive within `maxTimeMsToWaitResponse` milliseconds, the `<Promise>` will be rejected with
`TimeoutToReceiveResponseError`.  
Example of usage: [sendingBinaryRequests.mjs](/examples/sendingBinaryRequests.mjs)

### sendFragmentsOfBinaryRequest(...fragments)

* `...fragments <ArrayBuffer|Uint8Array|Int8Array|Uint16Array|Int16Array|Uint32Array|Int32Array|Float32Array|Float64Array>`
Parts of request
* Returns `<Promise<ArrayBuffer>>`

Sends binary request, similar as `sendBinaryRequest`.
The method sends data in fragments, without connecting the parts into one body,
avoiding allocating memory for the entire response.  
Example of usage:

```js
const smallHeader = new Uint8Array([1, 2, 3, 4]).buffer;
const bigBody = new Uint8Array([10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 1, 2, 3, 4, 5, 6, 7, 8, 9]).buffer;
const responseData = await connection.sendFragmentsOfBinaryRequest(smallHeader, bigBody);
```

### sendFragmentsOfUnrequestingBinaryMessage(...fragments)

* `...fragments <ArrayBuffer|Uint8Array|Int8Array|Uint16Array|Int16Array|Uint32Array|Int32Array|Float32Array|Float64Array>`
Parts of message

Sends binary unrequesting message, similar as `sendUnrequestingBinaryMessage`.
The method sends data in fragments, without connecting parts into one body,
avoiding memory allocation for the entire message.

### sendUnrequestingBinaryMessage(message)

* `message <string|ArrayBuffer|Uint8Array|Int8Array|Uint16Array|Int16Array|Uint32Array|Int32Array|Float32Array|Float64Array>`

Sends binary message without waiting response.
The method expects to receive the message body without free space for the header, unlike
`sendUnrequestingBinaryMessage` of the `ResponsiveWebSocketClient` class.
Recepient can handle data by setting listener whith `setUnrequestingBinaryMessageListener` method.

### setBinaryRequestListener(listener)

* `listener <function>`  
listener's signature: `(bytes, startIndex, responseSender)`
    * `bytes <ArrayBuffer>` Message containing the header and the body transmitted by the sender
    * `startIndex <number>` Index of the first byte of the message body
    * `responseSender <ServerConnectionResponseSender>` Object for sending response

Sets the listener of event, that occurs when a binary message is received,
the sender of which is waiting for a response.
`this` link inside the handler points to an instance of the `ResponsiveWebSocketServerConnection` class.  
Example of usage: [sendingBinaryRequests.mjs](/examples/sendingBinaryRequests.mjs)

### setTextMessageListener(listener)

* `listener <function>`  
listener's signature: `(message)`
    * `message <ArrayBuffer>` Binary data with a text message in UTF-8 encoding received by WebSocket

Sets the listener of event, that occurs when a text message is received.

### userData

* `<any>`

Optional field for information attached to the server connection object
when calling the `acceptConnection(userData)` method of the `HandshakeAction` instance.

### Class ServerConnectionResponseSender

Server-side class that sends a response to a request. The method for sending the response is called only 1 time.

### sendBinaryResponse(message)

* `message <ArrayBuffer|Uint8Array|Int8Array|Uint16Array|Int16Array|Uint32Array|Int32Array|Float32Array|Float64Array>`
Response

Sends binary response.
The method expects to receive the message body without free space for the header, unlike
`sendBinaryResponse` of the `ClientResponseSender` class.

### sendFragmentsOfBinaryResponse(...fragments)

* `...fragments <ArrayBuffer|Uint8Array|Int8Array|Uint16Array|Int16Array|Uint32Array|Int32Array|Float32Array|Float64Array>`
Parts of response

Sends binary response, similas as `sendBinaryResponse`.
The method sends data in fragments, without connecting parts into one body,
avoiding memory allocation for the entire message.

[uWebSockets.js]: https://github.com/uNetworking/uWebSockets.js
