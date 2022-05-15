"use strict";

const ResponsiveWebSocketConnection = require(
  "./../common/ResponsiveWebSocketConnection/ResponsiveWebSocketConnection"
);

const {
  fillHeaderAsUnrequestingMessage: fillHeaderAsUnrequestingBinaryMessage,
  sizeOfHeaderForRequest: sizeOfHeaderForBinaryRequest,
  sizeOfHeaderForResponse: sizeOfHeaderForBinaryResponse,
  sizeOfHeaderForUnrequestingMessage: sizeOfHeaderForUnrequestingBinaryMessage
} = require("./../common/ResponsiveWebSocketConnection/modules/messaging/binaryMessages/binaryMessager");

const _emitEventByIncomingMessage = require("./utils/emitEventByIncomingMessage");

let W3CWebSocketClientClass = null;

const {
  _connection,
  _onClose
} = ResponsiveWebSocketConnection._namesOfPrivateProperties;

const _protocols = Symbol();
const _options = Symbol();
const _onError = Symbol();

const ResponsiveWebSocketClient = class extends ResponsiveWebSocketConnection {
  constructor(protocols, options) {
    super();

    if (protocols) {
      this[_protocols] = protocols;
    }
    if (options) {
      this[_options] = options;
    }
  }

  get sizeOfHeaderForBinaryRequest() {
    return sizeOfHeaderForBinaryRequest;
  }

  get sizeOfHeaderForBinaryResponse() {
    return sizeOfHeaderForBinaryResponse;
  }

  get sizeOfHeaderForUnrequestingBinaryMessage() {
    return sizeOfHeaderForUnrequestingBinaryMessage;
  }

  setErrorListener(listenerOrNull) {
    this[_onError] = listenerOrNull;
  }

  connect(url) {
    return new Promise((resolve, reject) => {
      const options = this[_options];
      const client = this[_connection] = options ?
        new W3CWebSocketClientClass(url, this[_protocols], options) :
        new W3CWebSocketClientClass(url, this[_protocols]);

      client.binaryType = "arrayBuffer";

      const self = this;
      client.onopen = function onWebSocketLoad() {
        self._setupListenersOfEvents(client);
        client.onerror = _emitOnError.bind(this);
        resolve();
      };
      client.onerror = function onWebSocketFail(error) {
        _emitOnError.call(this, error);
        reject(error);
      };
    });
  }

  close(code, reason) { // args: code, reason
    const connection = this[_connection];
    return connection.close.apply(connection, arguments);
  }

  // only in nodejs
  terminate() {
    return this[_connection].terminate();
  }

  _setupListenersOfEvents(webSocketClient) {
    webSocketClient.onerror = _emitOnError.bind(this);
    webSocketClient.onclose = _emitOnClose.bind(this);
    webSocketClient.onmessage = _emitEventByIncomingMessage.bind(this);
  }

  sendBinaryRequest = require("./utils/sendBinaryRequest");

  sendUnrequestingBinaryMessage(messageInArrayBuffer) {
    fillHeaderAsUnrequestingBinaryMessage(messageInArrayBuffer);
    this[_connection].send(messageInArrayBuffer);
  }
};

ResponsiveWebSocketClient.setWebSocketClientClass = function setWebSocketClientClass(W3CWebSocket) {
  W3CWebSocketClientClass = W3CWebSocket;
};

const _emitOnError = function(error) {
  if (this[_onError]) {
    this[_onError](error);
  }
};

const _emitOnClose = function(event) {
  if (this[_onClose]) {
    this[_onClose](event);
  }
};

module.exports = ResponsiveWebSocketClient;
