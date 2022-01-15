"use strict";

const uWebSockets = require("uWebSockets.js"), 
      WebSocketConnectionWrapper = require("./WebSocketConnection");

const _socketOfServer = "_c",
      _server = "_s",
      _wrapper = "_";

const defaultIsCompressionUsed = false,
      defaultMaxPayloadLength =  10 * 1024 * 1024,
      defaultIdleTimeout = 600;

const WebSocketServer = class {
  constructor(options) {
    this.onConnectionCreated = null;
    this[_socketOfServer] = null;
    this[_server] = this._createServer(options);
  }
  
  _createServer(options) {
    return options ?
      this._createServerWithEventListeners(options) :
      this._createDefaultServerWithEventListeners();
  }

  _createServerWithEventListeners(options) {
    const server = options.server || new uWebSockets.App({}),
          url = options.url || "/*";
          
    return server.ws(url, {
      compression: options.useCompression || defaultIsCompressionUsed,
      maxPayloadLength: options.maxPayloadLength || defaultMaxPayloadLength,
      idleTimeout: options.idleTimeout || defaultIdleTimeout,
      
      open: this._emitConnectionEvent.bind(this),
      close: _emitClientsCloseEvent,
      message: _emitClientsMessageEvent,
      upgrade: _upgradeToWebSocket
    });
  }
  
  _createDefaultServerWithEventListeners() {
    return new uWebSockets.App({}).ws("/*", {
      compression: defaultIsCompressionUsed,
      maxPayloadLength: defaultMaxPayloadLength,
      idleTimeout: defaultIdleTimeout,
      
      open: this._emitConnectionEvent.bind(this),
      close: _emitClientsCloseEvent,
      message: _emitClientsMessageEvent,
      upgrade: _upgradeToWebSocket
    });
  }
  
  _emitConnectionEvent(connectionToClient) {
    const wrapper = new WebSocketConnectionWrapper(connectionToClient);
    connectionToClient[_wrapper] = wrapper;
    this.onConnectionCreated(wrapper);
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

const _emitClientsMessageEvent = function(connectionToClient, message, isBinary) {
  if (isBinary) { 
    _emitClientsBinaryMessageEvent(connectionToClient, message);
  } else {
    _emitClientsTextMessageEvent(connectionToClient, message);
  }
};

const _emitClientsBinaryMessageEvent = function(connectionToClient, message) {
  const wrappedConnectionAPI = connectionToClient[_wrapper];
  wrappedConnectionAPI._emitOnBinaryMessage(message);
};

const _emitClientsTextMessageEvent = function(connectionToClient, message) {
  const wrappedConnectionAPI = connectionToClient[_wrapper];
  wrappedConnectionAPI._emitOnTextMessage(message);
};

const _emitClientsCloseEvent = function(connectionToClient, reason, code) {
  let wrappedConnectionAPI = connectionToClient[_wrapper];
  wrappedConnectionAPI._emitOnClose(reason, code);
};

const _upgradeToWebSocket = function(response, request, usSocketContext) {
  return response.upgrade(
    {url: request.getUrl()},
    request.getHeader('sec-websocket-key'),
    request.getHeader('sec-websocket-protocol'),
    request.getHeader('sec-websocket-extensions'),
    usSocketContext);
};

module.exports = WebSocketServer;
