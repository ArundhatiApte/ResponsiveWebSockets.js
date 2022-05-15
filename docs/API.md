# Responsive Web Sockets API

#### Table of Contents

- [Class: ResponsiveWebSocketConnection](#class-responsivewebsocketconnection)
    * close([code, reason])
    * setCloseListener(listener)
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
    * new ResponsiveWebSocketServer([options])
    * close()
    * listen(port)
    * setConnectionListener(listener)
    * setUpgradeListener(listener)
- [Class: HandshakeAction](class-handshakeaction)
    * acceptConnection([userData])
    * cancelConnection()
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

Sets the WebSocket connection close event handler.
`this` link inside the handler points to an instance of the `ResponsiveWebSocketConnection` class.
`listener` can be `null`.

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
`listener` can be `null`.  
Example of usage: [sendingUnrequestingBinaryMessages.mjs](/examples/sendingUnrequestingBinaryMessages.mjs)

### startIndexOfBodyInBinaryResponse

* `<number>`

Index of the first byte, from which the message body begins.

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
    * `responseSender <ClientResponseSender>` Object for sending binary or text response

Sets the listener of event, that occurs when a binary message is received,
the sender of which is waiting for a response.
`this` link inside the handler points to an instance of the `ResponsiveWebSocketClient` class.
`listener` can be `null`.  
Example of usage: [sendingBinaryRequests.mjs](/examples/sendingBinaryRequests.mjs)

### setTextMessageListener(listener)

* `listener <function>`
listener's signature: `(message)`
    * `message <string>` Text message received by WebSocket

Sets the listener of event, that occurs when a text message is received.
`this` link inside the handler points to an instance of the `ResponsiveWebSocketClient` class.
`listener` can be `null`.

### static setWebSocketClientClass(W3CWebSocketClient)

* `W3CWebSocketClient <function>` Class, implementing WebSocketClient interface by W3C

Sets the WebSocket class, on the base of which objects of the `ResponsiveWebSocketClient` class will be created.
The method must be called before the first call of the `ResponsiveWebSocketClient` constructor.

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

A client-side class that sends a response to a request.
The method for sending the response is called only 1 time.

### sendBinaryResponse(message)

* `message <ArrayBuffer>` Message containing a free space for the header at the beginning.
The size of header is equal to the value of the `sizeOfHeaderForBinaryResponse` property
of the `ResponsiveWebSocketClient` class object.

Sends binary response. Example of usage: [sendingBinaryRequests.mjs](/examples/sendingBinaryRequests.mjs).

## Class ResponsiveWebSocketServer

### new ResponsiveWebSocketServer([options])

* `options <Object>` [uWebSockets.js doc](https://unetworking.github.io/uWebSockets.js/generated/interfaces/WebSocketBehavior.html)  
    * `compression <number>`
    * `idleTimeout <number>`
    * `maxBackpressure <number>`
    * `maxPayloadLength <number>`
    * `sendPingsAutomatically `
    * `server` `<App>` или `<SSLApp>` модуля uWebSockets.js
    По умолчанию создается новый http сервер.
    * `url <string>`
    Адрес подключения к webSocket серверу. Пример: "/wsAPI/*", "/room/*". По умолчанию "/*".

Создает отзывчивый WebSocket сервер.

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

### setConnectionListener(listener)

* `listener <function>`  
listener's signature: `(connection)`
    * `connection <ResponsiveWebSocketServerConnection>` connection to the client

The connection event occurs when the WebSocket client connects to the server.
`this` link inside the handler points to an instance of the `ResponsiveWebSocketServer` class.
`listener` can be `null.

### setUpgradeListener(listener)

* `listenet <function>`
сигнатура обработчика: `(httpRequest, handshakeAction)`
    * `httpRequest <HttpRequest>` Запрос из модуля uWebSockets.js
    * `handshakeAction <HandshakeAction>`
    Объект, позволяющий принять или отклонить запрос на создание WebSocket соединения

Устанавливает обработчик события, происходящего при запросе на создание WebSocket соединения.
По умолчанию все подключения принимаются.
Ссылка `this` внутри обработчика указывает на объект экземпляра `ResponsiveWebSocketServer`.
`listener` может быть равен `null`.

### setUpgradeListener(listener)

* `listener <function>`
listener's signature: `(httpRequest, handshakeAction)`
    * `httpRequest <HttpRequest>` Request from uWebSockets.js
    * `handshakeAction <HandshakeAction>`
    Object that can accept or reject a request for creating a WebSocket connection

Sets the event handler that occurs when server receive request to create a WebSocket connection.
By default, all connections are accepted.
`this` link inside the handler points to the instance object `ResponsiveWebSocketServer'.
`listener` can be `null`.

## Class HandshakeAction

Class that accepts or rejects requests to create a WebSocket connection.
