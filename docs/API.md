## Table of contents

- [Class: ResponsiveWebSocketConnection](#class-responsivewebsocketconnection)
    * close([code, reason])
    * static contentTypesOfMessages
    * sendBinaryRequest(bytes[, maxTimeMsToWaitResponse])
    * sendTextRequest(text[, maxTimeMsToWaitResponse])
    * sendUnrequestingBinaryMessage(bytes)
    * sendUnrequestingTextMessage(text)
    * setBinaryRequestListener(listener)
    * setCloseListener(listener)
    * setMaxTimeMsToWaitResponse(timeMs)
    * setUnrequestingBinaryMessageListener(listener)
    * setUnrequestingTextMessageListener(listener)
    * startIndexOfBodyInBinaryResponse
    * startIndexOfBodyInTextResponse
    * terminate()
    * static class TimeoutToReceiveResponseException
- [Class: ResponsiveWebSocketClient](#class-responsivewebsocketclient)
    * new ResponsiveWebSocketClient()
    * connect(url)
    * static setWebSocketClientClass(W3CWebSocketClient)
- [Class: ResponsiveWebSocketServer](#class-responsivewebSocketserver)
    * new ResponsiveWebSocketServer()
    * close()
    * listen(port)
    * setConnectionListener(listener)
- [Class: ResponsiveWebSocketServerConnection](#class-responsivewebsocketserverconnection)
    * getRemoteAddress()
    * url
- [Class: ResponseSender](#class-responsesender)
- [Class: ResponseData](#class-responsedata)

## Class: ResponsiveWebSocketConnection

Base class for client and connection to client.
Provides methods for sending awaiting response messages and messages without waiting response.

### close([code, reason])

* `code` `<number>`
* `reason` `<string>`

Closes connection.

### static contentTypesOfMessages

* `<Object>`
    * `binary <number>` type of binary message
    * `text <number>` type of text message

### sendBinaryRequest(bytes[, maxTimeMsToWaitResponse])

* `bytes <ArrayBuffer>`
* `maxTimeMsToWaitResponse <number>`  
optional, by default value of `maxTimeMsToWaitResponse` property
* Returns `<Promise<ResponseData>>`

Sends awaiting response binary message. Receiver can give response by setting lisneter of 'binaryRequest' event.
If response will not arrive within `maxTimeMsToWaitResponse` milliseconds, the `<Promise>` will be rejected with
`TimeoutToReceiveResponseException`.  
Example of usage: [sendingRequests.mjs](./examples/sendingRequests.mjs)

### sendTextRequest(text[, maxTimeMsToWaitResponse])

* `text <string>`
* `maxTimeMsToWaitResponse <number>`  
optional, by default value of `maxTimeMsToWaitResponse` property.
* Returns `<Promise<ResponseData>>`

Sends awaiting response text message. Receiver can give response by setting lisneter of 'textRequest' event.
If response will not arrive within `maxTimeMsToWaitResponse` milliseconds, the `<Promise>` will be rejected with
`TimeoutToReceiveResponseException`.  
Example of usage: [sendingRequests.mjs](./examples/sendingRequests.mjs)

### sendUnrequestingBinaryMessage(bytes)

* `bytes <ArrayBuffer>`

Sends binary message without waiting response.
When a message arrives to the recipient, the 'unrequestingBinaryMessage' event is generated.
 
### sendUnrequestingTextMessage(text)

* `text <string>`

Sends text message without waiting response.
When a message arrives to the recipient, the 'unrequestingTextMessage' event is generated.

### setBinaryRequestListener(listener)

* `listener <function>`  
listeners signature: `(bytes, startIndex, responseSender)`
    * `bytes <ArrayBuffer>`
    a message containing the header and the body transmitted by the sender
    * `startIndex <number>`
    index of the first byte of the message body
    * `responseSender <ResponseSender>`
    object for sending binary or text response

Sets the listener of event, that occurs when a binary message is received, the sender of which is waiting for a response.
Example of usage: [sendingRequests.mjs](./examples/sendingRequests.mjs)

### setCloseListener(listener)

* `listener <function>`  
listeners signature: `(event)`
    * `event <Object>`
        * `code <number>`
        * `reason <string>`
        * `wasClean <bool>`

### setMaxTimeMsToWaitResponse(timeMs)

* `timeMs <number>`

Default maximum time in milliseconds for waiting response on request.
This time can be redefined in second parametr in `sendBinaryRequest` or `sendTextRequest` methods.
By default 2000.

### setTextRequestListener(listener)

* `listener <function>`  
listeners signature: `(text, startIndex, responseSender)`
    * `text <string>`  
    a message containing the header and the body transmitted by the sender
    * `startIndex <number>`  
    the index of the first character in the `text` string, from which the message body begins
    * `responseSender <ResponseSender>`
    object for sending binary or text response

Sets the listener of event, that occurs when a text message is received, the sender of which is waiting for a response.
Example of usage: [sendingRequests.mjs](./examples/sendingRequests.mjs)

### setUnrequestingBinaryMessageListener(listener)

* `listener <function>`  
listeners signature: `(bytes, startIndex)`
    * `bytes <ArrayBuffer>`  
a message containing the header and the body transmitted from the sender
    * `startIndex <number>`  
index of the first byte of the message body

Sets the listener of event, that occurs when a binary message is received, the sender of which is not waiting for a response.
Example of usage: [sendingUnrequestingMessages.mjs](./examples/sendingUnrequestingMessages.mjs)

### setUnrequestingTextMessageListener(listener)

* `listener <function>`  
listeners signature: `(text, startIndex)`
    * `text <string>`  
a message containing the header and the body transmitted from the sender
    * `startIndex <number>`  
the index of the first character in the `text` string, from which the message body begins

Sets the listener of event, that occurs when a text message is received, the sender of which is not waiting for a response.
Example of usage: [sendingUnrequestingMessages.mjs](./examples/sendingUnrequestingMessages.mjs)

### startIndexOfBodyInBinaryResponse

* `<number>`

Index of the first byte, from which the message body begins.

### startIndexOfBodyInTextResponse

* `<number>`

Index of the first character, from which the message body begins.

### terminate()

Forcibly close the connection. ResponsiveWebSocketClient in browser does not implement this method.

### Static class TimeoutToReceiveResponseException

Exeption, that throwed when the response to the request did not  arrive during the `maxTimeMsToWaitResponse`.

## Class ResponsiveWebSocketClient

### new ResponsiveWebSocketClient()

Creates new ResponsiveWebSocketClient, without arguments.

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

* options <Object>  
    * `compression <number>` [uWebSockets.js doc](https://unetworking.github.io/uWebSockets.js/generated/interfaces/WebSocketBehavior.html#compression)
    * `idleTimeout <number>` [uWebSockets.js doc](https://unetworking.github.io/uWebSockets.js/generated/interfaces/WebSocketBehavior.html#idleTimeout)
    * `maxBackpressure <number>` [uWebSockets.js doc](https://unetworking.github.io/uWebSockets.js/generated/interfaces/WebSocketBehavior.html#maxBackpressure)
    * `maxPayloadLength <number>` [uWebSockets.js doc](https://unetworking.github.io/uWebSockets.js/generated/interfaces/WebSocketBehavior.html#maxPayloadLength)
    * `sendPingsAutomatically ` [uWebSockets.js doc](https://unetworking.github.io/uWebSockets.js/generated/interfaces/WebSocketBehavior.html#sendPingsAutomatically)
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
listeners signature: `function(connection)`
    * `connection <ResponsiveWebSocketServerConnection>` connection to the client

The 'connection' event occurs when the WebSocket client connects to the server.

## Class ResponsiveWebSocketServerConnection

Extends ResponsiveWebSocketConnection. Connection to the client.

### getRemoteAddress()

* Returns `<ArrayBuffer>`

Returns the remote binary IP address.
IPv4 is 4 byte long and can be converted to text by printing every byte as a digit between 0 and 255.
IPv6 is 16 byte long and can be converted to text by printing every byte as a digit between 0 and 255 in HEX.

### url `<string>`

Address, to which WebSocket client connected.

## Class ResponseSender

An object passed to the handlers of 'binaryRequest' and 'textRequest' event.
You can send a binary or text response to a binary request.
You can send a text or binary response to a text request.
The method for sending the response (sendBinaryResponse or sendTextResponse) is called only 1 time.

### sendBinaryResponse(bytes)

* `bytes <ArrayBuffer>` the response

### sendTextResponse(text)

* `text <string>` the response

## Class ResponseData

Data about response.

### contentType

* `<number>`

Content type of the response. Value of `contentTypesOfMessages` enumeration,
`contentTypesOfMessages.binary` or `contentTypesOfMessages.text`.
    
### message

* `<ArrayBuffer>` or `<string>`

The response received over the web socket containing the service header and body.
