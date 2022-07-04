"use strict";

const ResponsiveWrapperOfWebSocketConnection = require(
  "./modules/ResponsiveWrapperOfWebSocketConnection/ResponsiveWrapperOfWebSocketConnection"
);
const AcceptorOfRequestForUpgrade = require("./modules/AcceptorOfRequestForUpgrade");

const ResponsiveWebSocketServer = class {
  constructor(options) {
    this[_socketOfServer] = null;
    if (!options) {
      throw new Error("Options is missed.");
    }
    this[_server] = _createServerWithEventListeners(this, options);
  }

  setConnectionListener(listenerOrNull) {
    this[_onConnection] = listenerOrNull;
  }

  setUpgradeListener(listenerOrNull) {
    this[_onUpgrade] = listenerOrNull;
  }

  listen(port) {
    return new Promise((resolve, reject) => {
      return this[_server].listen(port, (token) => {
        if ((token !== undefined) && (token !== null)) {
          this[_socketOfServer] = token;
          resolve();
        } else {
          reject(new Error("Failed attemp to listen port: " + port));
        }
      });
    });
  }

  close() {
    return uWebSockets.us_listen_socket_close(this[_socketOfServer]);
  }

  static setUWebSockets(uWebSocketsImpl) {
    uWebSockets = uWebSocketsImpl;
  }
};

let uWebSockets;

const _socketOfServer = Symbol(),
      _server = Symbol(),
      _wrapper = Symbol(),
      _onConnection = Symbol(),
      _onUpgrade = Symbol();

const defaultIsCompressionUsed = false,
      defaultMaxPayloadLength =  10 * 1024 * 1024,
      defaultIdleTimeout = 600;

const _createServerWithEventListeners = function(responsiveWebSocketServer, options) {
  const server = options.server;
  if (!server) {
    throw new Error("uWebSockets server is missed.")
  }
  const url = options.url || "/*";

  return server.ws(url, {
    compression: options.useCompression || defaultIsCompressionUsed,
    maxPayloadLength: options.maxPayloadLength || defaultMaxPayloadLength,
    idleTimeout: options.idleTimeout || defaultIdleTimeout,

    open: _emitConnectionEvent.bind(responsiveWebSocketServer),
    close: _emitClientsCloseEvent,
    message: _emitClientsMessageEvent,
    upgrade: _upgradeToWebSocketByDefaulOrCallListener.bind(responsiveWebSocketServer)
  });
};

const _emitConnectionEvent = function(connectionToClient) {
  const wrapper = new ResponsiveWrapperOfWebSocketConnection(connectionToClient);
  connectionToClient[_wrapper] = wrapper;
  this[_onConnection](wrapper);
};

const _emitClientsMessageEvent = function(connectionToClient, message, isBinary) {
  if (isBinary) {
    _emitClientsBinaryMessageEvent(connectionToClient, message);
  } else {
    _emitClientsTextMessageEvent(connectionToClient, message);
  }
};

const {
  _acceptBinaryMessage,
  _acceptTextMessage,
  _acceptEventOfClosing
} = ResponsiveWrapperOfWebSocketConnection;

const _emitClientsBinaryMessageEvent = function(connectionToClient, message) {
  return _acceptBinaryMessage(connectionToClient[_wrapper], message);
};

const _emitClientsTextMessageEvent = function(connectionToClient, messageInArrayBufferInUTF8) {
  return _acceptTextMessage(connectionToClient[_wrapper], messageInArrayBufferInUTF8);
};

const _emitClientsCloseEvent = function(connectionToClient, code, reasonInArrayBufferInUTF8) {
  return _acceptEventOfClosing(connectionToClient[_wrapper], code, reasonInArrayBufferInUTF8);
};

const _upgradeToWebSocketByDefaulOrCallListener = (function() {
  const upgradeToWebSocketByDefaulOrCallListener = function(httpResponse, httpRequest, usSocketContext) {
    const server = this;
    const listenerOfRequest = server[_onUpgrade];
    if (listenerOfRequest) {
      _callListenerOfRequest(server, listenerOfRequest, httpRequest, httpResponse, usSocketContext);
    } else {
      _upgradeToWebSocketByDefault(httpRequest, httpResponse, usSocketContext);
    }
  };

  const _upgradeToWebSocketByDefault = function(httpRequest, httpResponse, usSocketContext) {
    return httpResponse.upgrade(
      {url: httpRequest.getUrl()},
      httpRequest.getHeader("sec-websocket-key"),
      httpRequest.getHeader("sec-websocket-protocol"),
      httpRequest.getHeader("sec-websocket-extensions"),
      usSocketContext
    );
  };

  const _callListenerOfRequest = function(server, listenerOfRequest, httpRequest, httpResponse, usSocketContext) {
    const acceptorOfRequest = new AcceptorOfRequestForUpgrade(
      httpRequest,
      httpResponse,
      usSocketContext
    );
    httpResponse.onAborted(_voidFnForAsync);
    listenerOfRequest.call(server, httpRequest, acceptorOfRequest);
  };
  const _voidFnForAsync = function() {};

  return upgradeToWebSocketByDefaulOrCallListener;
})();

module.exports = ResponsiveWebSocketServer;
