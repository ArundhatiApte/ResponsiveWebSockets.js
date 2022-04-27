"use strict";

const ResponsiveWebSocketConnection = require("./../common/ResponsiveWebSocketConnection/ResponsiveWebSocketConnection");

const {
  binaryMessager: {
    createUnrequestingMessage: createUnrequestingBinaryMessage
  },
  textMessager: {
    createUnrequestingMessage: createUnrequestingTextMessage
  },
} = require("./modules/messaging/messaging");
const _emitEventByIncomingMessage = require("./methods/emitEventByIncomingMessage");

let W3CWebSocketClientClass = null;

const {
  _connection,
  _onClose
} = ResponsiveWebSocketConnection._namesOfPrivateProperties;
const _onError = "_6";

const ResponsiveWebSocketClient = class extends ResponsiveWebSocketConnection {
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
    webSocketClient.onmessage = _emitEventByIncomingMessage.bind(this);
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

Proto.sendBinaryRequest = require("./methods/sendBinaryRequest");
Proto.sendTextRequest = require("./methods/sendTextRequest");

const createMethodToSendUnrequestingMessage = function(createUnrequestingMessage) {
  return function sendUnrequestingMessage(message) {
    return this[_connection].send(createUnrequestingMessage(message));
  };
};

Proto.sendUnrequestingBinaryMessage = createMethodToSendUnrequestingMessage(createUnrequestingBinaryMessage);
Proto.sendUnrequestingTextMessage = createMethodToSendUnrequestingMessage(createUnrequestingTextMessage);
