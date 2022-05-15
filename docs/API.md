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

### close([code, reason])

* `code <number>`
* `reason <string>`

Initiate a closing handshake.
