"use strict";

const ResponsiveConnection = require("./../common/ResponsiveConnection/ResponsiveConnection");

const {
  binaryMessager,
  textMessager
} = require("./modules/messaging/messaging");

let W3CWebSocketClientClass = null;

const {
  _connection,
  _onClose
} = ResponsiveConnection._namesOfPrivateProperties;
const _onError = "_6";

const ResponsiveWebSocketClient = class extends ResponsiveConnection {
  constructor() {
    super();
  }

  setErrorListener(listenerOrNull) {
    this[_onError] = listenerOrNull;
  }

  connect(url) {
    return new Promise((resolve, reject) => {
      const client = this[_connection] = new W3CWebSocketClientClass(url);      
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

  close(code, reason) {
    return this[_connection].close(code, reason);
  }

  // only in nodejs
  terminate() {
    return this[_connection].terminate();
  }

  _setupListenersOfEvents(webSocketClient) {
    webSocketClient.onerror = _emitOnError.bind(this);
    webSocketClient.onclose = _emitOnClose.bind(this);
    webSocketClient.onmessage = _emitEventByIncominMessage.bind(this);
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

const Proto = ResponsiveWebSocketClient.prototype;
const _emitEventByIncominMessage = require("./methods/emitEventByIncominMessage");

const createMethodToSendRequest = require("./methods/createMethodToSendRequest");

Proto.sendBinaryRequest = createMethodToSendRequest(binaryMessager.createRequestMessage);
Proto.sendTextRequest = createMethodToSendRequest(textMessager.createRequestMessage);

const createMethodToSendUnrequestingMessage = function(createUnrequestingMessage) {
  return function sendUnrequestingMessage(message) {
    const messageWithHeader = createUnrequestingMessage(message);
    this[_connection].send(messageWithHeader);
  };
};

Proto.sendUnrequestingBinaryMessage = createMethodToSendUnrequestingMessage(binaryMessager.createUnrequestingMessage);
Proto.sendUnrequestingTextMessage = createMethodToSendUnrequestingMessage(textMessager.createUnrequestingMessage);
