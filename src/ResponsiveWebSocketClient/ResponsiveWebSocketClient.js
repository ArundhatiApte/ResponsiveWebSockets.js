"use strict";

const WebSocketClient = require("./modules/WebSocketClient"),
      ResponsiveWebSoket = require("./../common/ResponsiveWebSocketConnection");
      
const {_connection, _onError} = ResponsiveWebSoket._namesOfPrivateProperties;

const ResponsiveWebSocketClient = class extends ResponsiveWebSoket {
  constructor(webSocketClient) {
    super(webSocketClient || new WebSocketClient());
  }

  setLoadListener(listener) {
    this[_onLoad] = listener;
  }
  
  _setupListeners() {
    this._setupOnLoadListener();
    this._setupOnErrorListener();
    this._setupOnMessageListener();
  }
  
  _setupOnLoadListener() {
    this[_connection].onLoad = () => {
      this[_connection].onLoad = null;
      if (this[_onLoad]) {
        this[_onLoad]();
      }
    };
  }
  
  _setupOnErrorListener() {
    this[_connection].onError = (error) => {
      if (this[_onError]) {
        this[_onError](error);
      }
    };
  }
  
  connect(url) {
    return this[_connection].connect(url);
  }
  
  close() {
    return this[_connection].close();
  }
};

const _onLoad = "_77";

ResponsiveWebSocketClient.contentTypesOfMessages = ResponsiveWebSoket.contentTypesOfMessages;
ResponsiveWebSocketClient.setWebSocketClientClass = WebSocketClient.setWebSocketClientClass;

module.exports = ResponsiveWebSocketClient;
