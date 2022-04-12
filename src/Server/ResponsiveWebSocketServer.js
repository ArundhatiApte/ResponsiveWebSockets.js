"use strict";

const uWebSockets = require("uWebSockets.js");

const ResponsiveWrapperOfWebSocketConnection = require(
  "./modules/ResponsiveWrapperOfWebSocketConnection/ResponsiveWrapperOfWebSocketConnection"
);
const AcceptorOfRequestForUpgrade = require("./modules/AcceptorOfRequestForUpgrade");

const ResponsiveWebSocketServer = class {
  constructor(options) {
    this[_socketOfServer] = null;
    this[_server] = _createServer(this, options);
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
};

const _socketOfServer = Symbol(),
      _server = Symbol(),
      _wrapper = Symbol(),
      _onConnection = Symbol(),
      _onUpgrade = Symbol();

const defaultIsCompressionUsed = false,
      defaultMaxPayloadLength =  10 * 1024 * 1024,
      defaultIdleTimeout = 600;

const _createServer = function(responsiveWebSocketServer, options) {
  return options ?
    _createServerWithEventListeners(responsiveWebSocketServer, options) :
    _createDefaultServerWithEventListeners(responsiveWebSocketServer);
};

const _createServerWithEventListeners = function(responsiveWebSocketServer, options) {
  const server = options.server || new uWebSockets.App({}),
        url = options.url || "/*";

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

const _createDefaultServerWithEventListeners = function(responsiveWebSocketServer) {
  return new uWebSockets.App({}).ws("/*", {
    compression: defaultIsCompressionUsed,
    maxPayloadLength: defaultMaxPayloadLength,
    idleTimeout: defaultIdleTimeout,

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
  _emitOnClose
} = ResponsiveWrapperOfWebSocketConnection;

const _emitClientsBinaryMessageEvent = function(connectionToClient, message) {
  const responsiveWrapper = connectionToClient[_wrapper];
  _acceptBinaryMessage(responsiveWrapper, message);
};

const _emitClientsTextMessageEvent = function(connectionToClient, message) {
  const responsiveWrapper = connectionToClient[_wrapper];
  const string = _decodeBytesToString(message);
  _acceptTextMessage(responsiveWrapper, string);
};
const _decodeBytesToString = TextDecoder.prototype.decode.bind(new TextDecoder("utf8"));

const _emitClientsCloseEvent = function(connectionToClient, code, reason) {
  let responsiveWrapper = connectionToClient[_wrapper];
  if (reason) {
    reason = _decodeBytesToString(reason);
    _emitOnClose(responsiveWrapper, code, reason);
  } else {
    _emitOnClose(responsiveWrapper, code);
  }
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
